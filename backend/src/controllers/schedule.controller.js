import { Schedule } from "../models/Schedule.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// add schedule
const addSchedule = asyncHandler(async (req, res) => {
  // Convert array field from string to array before destructure
  if (typeof req.body.day === "string")
    req.body.day = req.body?.day?.split(",");
  if (typeof req.body.section === "string")
    req.body.section = req.body?.section?.split(",");

  // Destructure essential fields
  const {
    name,
    time,
    day = [],
    class: schedulingClass,
    section = [],
    teacher,
    subject,
  } = req.body;

  // Check require fileds
  if (
    [name, time, schedulingClass, teacher, subject].some(
      (field) => field.trim() === ""
    )
  )
    throw new ApiError(400, "Pass the required field.");

  // Remove duplicate day and filter unique day
  let filteredDays = [];
  if (day.length > 0) {
    day.forEach((element) => {
      if (!filteredDays.includes(element.trim()) && element.trim() !== "")
        filteredDays.push(element.trim());
    });
  }

  let filteredSections = [];
  if (section.length > 0) {
    section.forEach((element) => {
      if (!filteredSections.includes(element.trim()) && element.trim() !== "")
        filteredSections.push(element.trim());
    });
  }

  // save to database
  const schedule = await Schedule.create({
    ...req.body,
    day: filteredDays,
    section: filteredSections,
  });
  if (!schedule) throw new ApiError(500, "Failed to create new schedule.");

  // get new schedule with teacher data
  const newSchedule = await Schedule.findById(schedule._id).populate(
    "teacher class",
    "_id name"
  );

  // return response with new schedule data
  return res
    .status(200)
    .json(new ApiResponse(201, "Schedule created successfully.", newSchedule));
});

// get schedule by id
const getSchedule = asyncHandler(async (req, res) => {
  // get id from params.
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid schedule id.");

  // search for the schedule
  const exitSchedule = await Schedule.findById(id)
    .populate("teacher class", "_id name")
    .select("-__v");
  if (!exitSchedule) throw new ApiError(404, "Schedule not exists.");

  // return response with schedule data
  res
    .status(200)
    .json(new ApiResponse(200, "Schedule found successfully", exitSchedule));
});

// // get all schedule
const getAllSchedule = asyncHandler(async (req, res) => {
  // search all schedules
  const schedules = await Schedule.find({}).populate(
    "teacher class",
    "_id name"
  );
  if (!schedules) throw new ApiError(404, "No schedules exists.");

  // return response data of all schedules
  res
    .status(200)
    .json(new ApiResponse(200, "All schedules found successfully", schedules));
});

// delete schedule
const deleteSchedule = asyncHandler(async (req, res) => {
  // get schedule id from params
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid schedule id.");

  // delete schedule data
  const deletedSchedule = await Schedule.findByIdAndDelete(id);
  if (!deletedSchedule) throw new ApiError(404, "Schedule not found.");

  // return response data of deleted schedule
  res
    .status(200)
    .json(
      new ApiResponse(200, "Schedule deleted successfully", deletedSchedule)
    );
});

// update schedule data
const updateSchedule = asyncHandler(async (req, res) => {
  // get id of schedule from params to update
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid schedule id.");

  // Convert array field from string to array before destructure
  if (typeof req.body.day === "string")
    req.body.day = req.body?.day?.split(",");
  if (typeof req.body.section === "string")
    req.body.section = req.body?.section?.split(",");

  // Destructure essential fields
  const {
    name,
    time,
    day = [],
    class: schedulingClass,
    section = [],
    teacher,
    subject,
  } = req.body;

  // Check require fileds
  if (
    [name, time, schedulingClass, teacher, subject].some(
      (field) => field.trim() === ""
    )
  )
    throw new ApiError(400, "Pass the required field.");

  // Check the already existence
  const existSchedule = await Schedule.findById(id);
  if (!existSchedule) throw new ApiError(404, "Schedule not exists");

  // Remove duplicate day and filter unique day
  let filteredDays = [];
  if (day.length > 0) {
    day.forEach((element) => {
      if (!filteredDays.includes(element.trim()) && element.trim() !== "")
        filteredDays.push(element.trim());
    });
  }
  let filteredSections = [];
  if (section.length > 0) {
    section.forEach((element) => {
      if (!filteredSections.includes(element.trim()) && element.trim() !== "")
        filteredSections.push(element.trim());
    });
  }

  // update to database
  const updatedClass = await Schedule.findByIdAndUpdate(
    id,
    {
      ...req.body,
      day: filteredDays,
      section: filteredSections,
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate("teacher class", "_id name");
  if (!updatedClass)
    throw new ApiError(500, "Failed to update schedule in database.");

  // return response data of updated schedule
  return res
    .status(200)
    .json(new ApiResponse(200, "Schedule updated successfully.", updatedClass));
});

export {
  addSchedule,
  getSchedule,
  getAllSchedule,
  deleteSchedule,
  updateSchedule,
};
