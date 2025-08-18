import { Admin } from "../models/admin.model.js";
import { Student } from "../models/student.model.js";
import { Teacher } from "../models/teacher.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field.trim() === ""))
    throw new ApiError(400, "Email and password are required.");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User does not exists.");

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Wrong password.");

  const accessToken = await user.generateAccessToken();
  if (!accessToken) throw new ApiError(500, "Failed to generate access token.");

  const loggedUser = await User.findByIdAndUpdate(
    user._id,
    { accessToken },
    { new: true }
  ).select("-password");

  let result;
  if (loggedUser.role === "admin") {
    result = await Admin.findOne({}).select("profileImage name _id");
  } else if (loggedUser.role === "teacher") {
    result = await Teacher.findOne({ email }).select("profileImage name _id");
  } else if (loggedUser.role === "student") {
    result = await Student.findOne({ email }).select("profileImage name _id");
  }
  const { profileImage, name } = result;
  if (!profileImage) throw new ApiError(404, "Failed to found user data.");

  const accessTokenExpiry = await loggedUser.getAccessTokenExpiry();

  res
    .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
    .status(200)
    .json(
      new ApiResponse(200, "Login successfully.", {
        name,
        email: loggedUser.email,
        role: loggedUser.role,
        authId: user._id,
        userDataId: result._id,
        profileImage,
        accessToken,
        accessTokenExpiry,
      })
    );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  const loggedOutUser = await User.findByIdAndUpdate(
    req.user?._id,
    { accessToken: "" },
    { new: true }
  ).select("-password -accessToken");

  if (!loggedOutUser) throw new ApiError(500, "Failed to logout user.");

  res
    .status(200)
    .clearCookie("accessToken", { httpOnly: true, secure: true })
    .json(new ApiResponse(200, "User logout successfully", loggedOutUser));
});

// change user password
const updateUserPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { oldPassword, newPassword } = req.body;

  if ((!oldPassword, !newPassword))
    throw new ApiError(400, "Please pass passwords field properly.");

  const user = await User.findById(id);

  const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isOldPasswordCorrect) throw new ApiError(400, "Old password is wrong.");

  const userWithUpdatedPassword = await User.findByIdAndUpdate(
    id,
    { password: newPassword },
    { new: true, runValidators: true }
  );
  if (!userWithUpdatedPassword)
    throw new ApiError(500, "Failed to update password in user.");

  // return response data of updated password
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Password updated successfully.",
        userWithUpdatedPassword
      )
    );
});

export { loginUser, logoutUser, updateUserPassword };
