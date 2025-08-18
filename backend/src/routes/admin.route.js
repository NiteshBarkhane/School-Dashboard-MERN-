import express from "express";
import { getAdmin, getAllRecords, updateAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

router.route("/get").get(getAdmin);
router.route("/update").put(updateAdmin);
router.route("/records").get(getAllRecords)

export default router;
