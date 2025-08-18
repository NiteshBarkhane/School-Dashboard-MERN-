import express from "express";
import { loginUser, logoutUser, updateUserPassword } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/logout").post(verifyToken, logoutUser);
router.route("/change_password/:id").put(updateUserPassword)

export default router;
