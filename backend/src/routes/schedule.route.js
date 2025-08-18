import express from "express";
import {
  addSchedule,
  deleteSchedule,
  getAllSchedule,
  getSchedule,
  updateSchedule,
} from "../controllers/schedule.controller.js";

const router = express.Router();

router.route("/create").post(addSchedule);
router.route("/single/:id").get(getSchedule);
router.route("/all").get(getAllSchedule);
router.route("/delete/:id").delete(deleteSchedule);
router.route("/update/:id").put(updateSchedule);

export default router;
