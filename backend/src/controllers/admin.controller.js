import { Admin } from "../models/admin.model.js";
import { Class } from "../models/class.model.js";
import { Schedule } from "../models/Schedule.model.js";
import { Student } from "../models/student.model.js";
import { Teacher } from "../models/teacher.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/cloudinary.js";

// get admin
const getAdmin = asyncHandler(async (req, res) => {
  const {id} = req.params
  // search for admin
  const admin = await Admin.findById(id).select("-__v");
  if (!admin) throw new ApiError(404, "Admin not found.");

  // return response data of admin
  res.status(200).json(new ApiResponse(200, "Admin found successfully", admin));
});

// update admin data
const updateAdmin = asyncHandler(async (req, res) => {
  // Destructure essential fields
  const { name, email } = req.body;
  const {id} = req.params
  const profileImage =
    req.files?.profileImage?.tempFilePath || req.body.profileImage || "";
    // Check require fileds
    if ([name, email].some((field) => field.trim() === ""))
      throw new ApiError(400, "Fill the required fields");
    
    // Check the already existence
    const admin = await Admin.findById(id);
    if (!admin) throw new ApiError(404, "Admin not found");
    const userWithExistingEmail = await User.findById(admin.authData);
    if (!userWithExistingEmail) throw new ApiError(404, "User not found");
    
    // If profileImage is passed and changed replace user profile on cloudinary
    let newProfileImageCloudinaryUrl = "";
    console.log(profileImage)
    console.log('admin.profileImage', admin.profileImage)
  if (profileImage && admin.profileImage !== profileImage) {
    const cloudinaryDeleteResponse = await deleteFromCloudinary(
      admin.profileImage
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

  const updatedAdmin = await Admin.findByIdAndUpdate(
    admin._id,
    {
      ...req.body,
      profileImage: newProfileImageCloudinaryUrl || profileImage,
    },
    { new: true, runValidators: true }
  ).select("-__v");
  if (!updatedAdmin)
    throw new ApiError(500, "Failed to update admin in database.");

  // return response data of updated admin
  return res
    .status(200)
    .json(new ApiResponse(200, "Admin updated successfully.", updatedAdmin));
});

// get all records quantity
const getAllRecords = asyncHandler(async (req, res) => {
  const students = await Student.countDocuments();
  const teachers = await Teacher.countDocuments();
  const classes = await Class.countDocuments();
  const schedules = await Schedule.countDocuments();

  // return the response data
  return res.status(200).json(
    new ApiResponse(200, "Records fetched successfully.", {
      students,
      teachers,
      classes,
      schedules,
    })
  );
});

export { getAdmin, updateAdmin, getAllRecords };
