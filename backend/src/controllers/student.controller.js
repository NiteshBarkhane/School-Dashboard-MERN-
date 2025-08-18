import { Student } from "../models/student.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/cloudinary.js";
import { createUser, deleteUser } from "../utils/userHandler.js";

// Register student
const registerStudent = asyncHandler(async (req, res) => {
  // Destructure essential fields
  const {
    name,
    email,
    password,
    fatherName,
    motherName,
    class: userClass,
    section,
    dob,
    phone,
  } = req.body;
  const profileImagePath =
    req.files?.profileImage?.tempFilePath || req.body.profileImage || "";

  // Check require fileds
  if (
    [
      name,
      email,
      password,
      fatherName,
      motherName,
      userClass,
      section,
      dob,
      phone,
    ].some((field) => field.trim() === "")
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
  const user = await createUser(email, password, "Student");
  if (!user) throw new ApiError(500, "Failed to store in database.");

  const { password: userPassword, ...allFieldsExceptPassword } = req.body; // extracting all fields except password. And password is title with userPassword because password variable is already been declared.

  const student = await Student.create({
    ...allFieldsExceptPassword,
    profileImage: newProfileImageCloudinaryUrl || profileImagePath,
    authData: user._id,
  });
  if (!student) throw new ApiError(500, "Failed to store in database.");

  const newStudent = await Student.findById(student._id).select(
    "-authData -__v"
  );
  // return response of new register student

  return res
    .status(200)
    .json(new ApiResponse(201, "Student register successfully.", newStudent));
});

// get Student by id
const getStudent = asyncHandler(async (req, res) => {
  // get id from params.
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid id.");

  // search for the student
  const student = await Student.findById(id).select("-authData -__v");
  if (!student) throw new ApiError(404, "Student not found.");

  // return response with student data
  res
    .status(200)
    .json(new ApiResponse(200, "Student found successfully", student));
});

// get all students
const getAllStudent = asyncHandler(async (req, res) => {
  // search all students
  const students = await Student.find({}).select("-authData -__v");
  if (!students) throw new ApiError(404, "Students not found.");

  // return response data of all student
  res
    .status(200)
    .json(new ApiResponse(200, "All students found successfully", students));
});

// delete student
const deleteStudent = asyncHandler(async (req, res) => {
  // get id from params
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid id.");

  // delete student data
  const deletedStudent = await Student.findByIdAndDelete(id);
  if (!deletedStudent) throw new ApiError(404, "Student not found.");

  // delete user
  const deletedUser = await deleteUser(deletedStudent.authData);
  if (!deletedUser) throw new ApiError(404, "User not found.");

  // return response data of deleted user
  res
    .status(200)
    .json(new ApiResponse(200, "Student deleted successfully", deletedUser));
});

// update student data
const updateStudent = asyncHandler(async (req, res) => {
  // get id of student from params to update
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid id.");

  // Destructure essential fields
  const {
    name,
    email,
    fatherName,
    motherName,
    class: userClass,
    section,
    dob,
    phone,
  } = req.body;
  const profileImage =
    req.files?.profileImage?.tempFilePath || req.body.profileImage || "";

  // Check require fileds
  if (
    [name, email, fatherName, motherName, userClass, section, dob, phone].some(
      (field) => field.trim() === ""
    )
  )
    throw new ApiError(400, "Fill the required fields");

  // Check the already existence
  const student = await Student.findById(id);
  if (!student) throw new ApiError(404, "Student not found");
  const userWithExistingEmail = await User.findById(student.authData);
  if (!userWithExistingEmail) throw new ApiError(404, "User not found");

  // If profileImage is passed and changed replace user profile on cloudinary
  let newProfileImageCloudinaryUrl = "";
  if (profileImage && student.profileImage !== profileImage) {
    const cloudinaryDeleteResponse = await deleteFromCloudinary(
      student.profileImage
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

  const updatedStudent = await Student.findByIdAndUpdate(
    id,
    {
      ...req.body,
      profileImage: newProfileImageCloudinaryUrl || profileImage,
    },
    { new: true, runValidators: true }
  ).select("-authData -__v");
  if (!updatedStudent)
    throw new ApiError(500, "Failed to update student in database.");

  // return response data of updated student
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Student updated successfully.", updatedStudent)
    );
});

export {
  registerStudent,
  getStudent,
  getAllStudent,
  deleteStudent,
  updateStudent,
};
