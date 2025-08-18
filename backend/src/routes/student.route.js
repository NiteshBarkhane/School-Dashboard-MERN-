import express from "express";
import {
  deleteStudent,
  getAllStudent,
  getStudent,
  registerStudent,
  updateStudent,
} from "../controllers/student.controller.js";

const router = express.Router();

router.route("/register").post(registerStudent);
router.route("/single/:id").get(getStudent);
router.route("/all").get(getAllStudent);
router.route("/delete/:id").delete(deleteStudent);
router.route("/update/:id").put(updateStudent);

export default router;
