import { Teacher } from "../models/teacher.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/cloudinary.js";
import { createUser, deleteUser } from "../utils/userHandler.js";

// Register teacher
const registerTeacher = asyncHandler(async (req, res) => {
  // Destructure essential fields
  const { name, email, password, qualification, dob, department, phone } =
    req.body;
  const profileImagePath =
    req.files?.profileImage?.tempFilePath || req.body.profileImage || "";

  // Check require fileds
  if (
    [name, email, password, qualification, dob, phone].some(
      (field) => field.trim() === ""
    )
  )
    throw new ApiError(400, "Fill the required fields");

  // Check the already existence
  const existUser = await User.findOne({ email });
  if (existUser) throw new ApiError(400, "User already exists");

  // Upload user profile to cloudinary
  const newProfileImageCloudinaryUrl = await uploadImageToCloudinary(
    profileImagePath
  );
  if (!newProfileImageCloudinaryUrl)
    throw new ApiError(
      500,
      "Profile image upload failed. Try after some time."
    );

  // save to database
  const user = await createUser(email, password, "Teacher");
  if (!user) throw new ApiError(500, "Failed to store in database.");

  const { password: userPassword, ...allFieldsExceptPassword } = req.body; // extracting all fields except password. And password is title with userPassword because password variable is already been declared.
  const teacher = await Teacher.create({
    ...allFieldsExceptPassword,
    qualification: (qualification && qualification.split(",")) || [],
    department: (department && department.split(",")) || [],
    profileImage: newProfileImageCloudinaryUrl || profileImagePath,
    authData: user._id,
  });
  if (!teacher) throw new ApiError(500, "Failed to store in database.");

  const newTeacher = await Teacher.findById(teacher._id).select(
    "-authData -__v"
  );
  // return response of new register teacher
  return res
    .status(200)
    .json(new ApiResponse(201, "Teacher register successfully.", newTeacher));
});

// get Teacher by id
const getTeacher = asyncHandler(async (req, res) => {
  // get id from params.
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid id.");

  // search for the teacher
  const teacher = await Teacher.findById(id).select("-authData -__v");
  if (!teacher) throw new ApiError(404, "Teacher not found.");

  // return response with teacher data
  res
    .status(200)
    .json(new ApiResponse(200, "Teacher found successfully", teacher));
});

// get all Teachers
const getAllTeacher = asyncHandler(async (req, res) => {
  // search all teachers
  const teachers = await Teacher.find({}).select("-authData -__v");
  if (!teachers) throw new ApiError(404, "Teachers not found.");

  // return response data of all teacher
  res
    .status(200)
    .json(new ApiResponse(200, "All teachers found successfully", teachers));
});

// delete teacher
const deleteTeacher = asyncHandler(async (req, res) => {
  // get id from params
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid id.");

  // delete teacher data
  const deletedTeacher = await Teacher.findByIdAndDelete(id);
  if (!deletedTeacher) throw new ApiError(404, "Teacher not found.");

  // delete user
  const deletedUser = await deleteUser(deletedTeacher.authData);
  if (!deletedUser) throw new ApiError(404, "User not found.");

  // return response data of deleted user
  res
    .status(200)
    .json(new ApiResponse(200, "Teacher deleted successfully", deletedUser));
});

// update teacher data
const updateTeacher = asyncHandler(async (req, res) => {
  // get id of teacher from params to update
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid id.");

  // Destructure essential fields
  const { name, email, qualification, dob, department, phone } = req.body;
  const profileImage =
    req.files?.profileImage?.tempFilePath || req.body.profileImage || "";

  // Check require fileds
  if (
    [name, email, qualification, dob, phone].some(
      (field) => field.trim() === ""
    )
  )
    throw new ApiError(400, "Fill the required fields");

  // Check the already existence
  const teacher = await Teacher.findById(id);
  if (!teacher) throw new ApiError(404, "Teacher not found");
  const userWithExistingEmail = await User.findById(teacher.authData);
  if (!userWithExistingEmail) throw new ApiError(404, "User not found");

  // If profileImage is passed and changed replace user profile on cloudinary
  let newProfileImageCloudinaryUrl = "";
  if (profileImage && teacher.profileImage !== profileImage) {
    const cloudinaryDeleteResponse = await deleteFromCloudinary(
      teacher.profileImage
    );
    if (!cloudinaryDeleteResponse)
      throw new ApiError(
        500,
        "Failed to delete old image. Try after some time."
      );

    newProfileImageCloudinaryUrl = await uploadImageToCloudinary(profileImage);
    if (!newProfileImageCloudinaryUrl)
      throw new ApiError(
        500,
        "Failed to update new image. Try after some time."
      );
  }

  // update to database
  // update email in user if its modified
  if (userWithExistingEmail.email !== email) {
    const userUpdatedEmail = await User.findByIdAndUpdate(
      userWithExistingEmail._id,
      { email },
      { new: true, runValidators: true }
    );
    if (!userUpdatedEmail)
      throw new ApiError(500, "Failed to update email in user.");
  }

  const updatedTeacher = await Teacher.findByIdAndUpdate(
    id,
    {
      ...req.body,
      department: (department && department.split(",")) || [],
      profileImage: newProfileImageCloudinaryUrl || profileImage,
    },
    { new: true, runValidators: true }
  ).select("-authData -__v");
  if (!updatedTeacher)
    throw new ApiError(500, "Failed to update teacher in database.");

  // return response data of updated teacher
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Teacher updated successfully.", updatedTeacher)
    );
});

export {
  registerTeacher,
  getTeacher,
  getAllTeacher,
  deleteTeacher,
  updateTeacher,
};
