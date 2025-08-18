import express from "express";
import {
  addDepartment,
  deleteDepartment,
  getAllDepartment,
  getDepartment,
  updateDepartment,
} from "../controllers/department.controller.js";

const router = express.Router();

router.route("/add").post(addDepartment);
router.route("/single/:id").get(getDepartment);
router.route("/all").get(getAllDepartment);
router.route("/delete/:id").delete(deleteDepartment);
router.route("/update/:id").put(updateDepartment);

export default router;
