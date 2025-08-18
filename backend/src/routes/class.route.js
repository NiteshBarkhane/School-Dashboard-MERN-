import express from "express";
import {
  addClass,
  deleteClass,
  getAllClass,
  getClass,
  updateClass,
} from "../controllers/class.controller.js";

const router = express.Router();

router.route("/create").post(addClass);
router.route("/single/:id").get(getClass);
router.route("/all").get(getAllClass);
router.route("/delete/:id").delete(deleteClass);
router.route("/update/:id").put(updateClass);

export default router;
