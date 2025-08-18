import { User } from "../models/user.model.js";

// Create user
const createUser = async (userEmail, userPassword, userRole) => {
  try {
    const createdUser = await User.create({
      email: userEmail,
      password: userPassword,
      role: userRole,
      accessToken: "",
    });
    return createdUser;
  } catch (error) {
    return null;
  }
};

// Create user
const deleteUser = async (userId) => {
  try {
    const deletedUser = await User.findByIdAndDelete(userId).select("-password -accessToken");
    return deletedUser;
  } catch (error) {
    return null;
  }
};

export { createUser, deleteUser };
