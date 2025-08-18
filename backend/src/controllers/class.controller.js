import { Class } from "../models/class.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// add class
const addClass = asyncHandler(async (req, res) => {
  // Convert array field from string to array before destructure
  if (typeof req.body.section === "string")
    req.body.section = req.body?.section?.split(",");
  if (typeof req.body.subject === "string")
    req.body.subject = req.body?.subject?.split(",");

  // Destructure essential fields
  const { name, section = [], subject = [] } = req.body;

  // Check require fileds
  if ([name].some((field) => field.trim() === ""))
    throw new ApiError(400, "Pass the name field");

  // Check the already existence
  const existClass = await Class.findOne({ name });
  if (existClass) throw new ApiError(400, "Class is already exists");

  // Remove duplicate sections and filter unique section
  const filteredSections = [];
  if (section.length > 0) {
    section.forEach((element) => {
      if (!filteredSections.includes(element.trim()) && element.trim() !== "")
        filteredSections.push(element.trim());
    });
  }

  // Remove duplicate sections and filter unique section
  const filteredSubjects = [];
  if (subject.length > 0) {
    subject.forEach((element) => {
      if (!filteredSubjects.includes(element.trim()) && element.trim() !== "")
        filteredSubjects.push(element.trim());
    });
  }

  // save to database
  const newClass = await Class.create({
    name,
    section: filteredSections.length > 0 ? filteredSections : ["A"],
    subject: filteredSubjects,
  });
  if (!newClass) throw new ApiError(500, "Failed to create new class.");

  // return response with new class data
  return res
    .status(200)
    .json(new ApiResponse(201, "Class created successfully.", newClass));
});

// get class by id
const getClass = asyncHandler(async (req, res) => {
  // get id from params.
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid class id.");

  // search for the class
  const exitClass = await Class.findById(id);
  if (!exitClass) throw new ApiError(404, "Class not exists.");

  // return response with class data
  res
    .status(200)
    .json(new ApiResponse(200, "Class found successfully", exitClass));
});

// // get all class
const getAllClass = asyncHandler(async (req, res) => {
  // search all classes
  const classes = await Class.find({});
  if (!classes) throw new ApiError(404, "No classes exists.");

  // return response data of all classes
  res
    .status(200)
    .json(new ApiResponse(200, "All classes found successfully", classes));
});

// delete class
const deleteClass = asyncHandler(async (req, res) => {
  // get class id from params
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid class id.");

  // delete class data
  const deletedClass = await Class.findByIdAndDelete(id);
  if (!deletedClass) throw new ApiError(404, "Class not found.");

  // return response data of deleted class
  res
    .status(200)
    .json(new ApiResponse(200, "Class deleted successfully", deletedClass));
});

// update class data
const updateClass = asyncHandler(async (req, res) => {
  // get id of class from params to update
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid class id.");

  // Convert array field from string to array before destructure
  req.body.section = req.body?.section?.split(",");
  req.body.subject = req.body?.subject?.split(",");

  // Destructure essential fields
  const { name, section = [], subject = [] } = req.body;

  // Check require fileds
  if ([name].some((field) => field.trim() === ""))
    throw new ApiError(400, "Fill the required fields");

  // Check the already existence
  const existClass = await Class.findById(id);
  if (!existClass) throw new ApiError(404, "Class not exists");

  // Remove duplicate sections and filter unique section
  const filteredSections = [];
  if (section.length > 0) {
    section.forEach((element) => {
      if (!filteredSections.includes(element.trim()) && element.trim() !== "") {
        filteredSections.push(element.trim());
      }
    });
  }

  // Remove duplicate sections and filter unique subject
  const filteredSubjects = [];
  if (subject.length > 0) {
    subject.forEach((element) => {
      if (!filteredSubjects.includes(element.trim()) && element.trim() !== "") {
        filteredSubjects.push(element.trim());
      }
    });
  }

  // update to database
  const updatedClass = await Class.findByIdAndUpdate(
    id,
    {
      name,
      section: filteredSections.length > 0 ? filteredSections : ["A"],
      subject:
        filteredSubjects.length > 0 ? filteredSubjects : existClass.subject,
    },
    { new: true, runValidators: true }
  );
  if (!updatedClass)
    throw new ApiError(500, "Failed to update class in database.");

  // return response data of updated class
  return res
    .status(200)
    .json(new ApiResponse(200, "Class updated successfully.", updatedClass));
});

export { addClass, getClass, getAllClass, deleteClass, updateClass };
