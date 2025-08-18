import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const verifyToken = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1];
  if (!token) throw new ApiError(401, "Unauthorized error.");

  let decode;
  try {
    decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token.");
  }
  const user = await User.findById(decode?._id).select("-password");
  if (!user || !user.accessToken)
    throw new ApiError(401, "Invalid access token.");

  req.user = user;
  next();
});

export { verifyToken };
