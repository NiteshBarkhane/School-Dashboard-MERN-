import express from "express";
import {
  deleteTeacher,
  getAllTeacher,
  getTeacher,
  registerTeacher,
  updateTeacher,
} from "../controllers/teacher.controller.js";

const router = express.Router();

router.route("/register").post(registerTeacher);
router.route("/single/:id").get(getTeacher);
router.route("/all").get(getAllTeacher);
router.route("/delete/:id").delete(deleteTeacher);
router.route("/update/:id").put(updateTeacher);

export default router;
