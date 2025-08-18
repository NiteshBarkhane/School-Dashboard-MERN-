import { Department } from "../models/department.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// add department
const addDepartment = asyncHandler(async (req, res) => {
  // Destructure essential fields
  const { name } = req.body;

  // Check require fileds
  if ([name].some((field) => field.trim() === ""))
    throw new ApiError(400, "Pass the department field");

  // Check the already existence
  const existDepartment = await Department.findOne({ name });
  if (existDepartment) throw new ApiError(400, "Department is already exists");

  // save to database
  const newDepartment = await Department.create({ name });
  if (!newDepartment)
    throw new ApiError(500, "Failed to create new department.");

  // return response with registered teacher data
  return res
    .status(200)
    .json(
      new ApiResponse(201, "Department created successfully.", newDepartment)
    );
});

// get department by id
const getDepartment = asyncHandler(async (req, res) => {
  // get id from params.
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid department id.");

  // search for the department
  const department = await Department.findById(id);
  if (!department) throw new ApiError(404, "Department not exists.");

  // return response with department data
  res
    .status(200)
    .json(new ApiResponse(200, "Department found successfully", department));
});

// get all department
const getAllDepartment = asyncHandler(async (req, res) => {
  // search all departments
  const departments = await Department.find({});
  if (!departments) throw new ApiError(404, "No departments exists.");

  // return response data of all departments
  res
    .status(200)
    .json(
      new ApiResponse(200, "All departments found successfully", departments)
    );
});

// delete department
const deleteDepartment = asyncHandler(async (req, res) => {
  // get department id from params
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid department id.");

  // delete department data
  const deletedDepartment = await Department.findByIdAndDelete(id);
  if (!deletedDepartment) throw new ApiError(404, "Teacher not found.");

  // return response data of deleted department
  res
    .status(200)
    .json(
      new ApiResponse(200, "Department deleted successfully", deletedDepartment)
    );
});

// update department data
const updateDepartment = asyncHandler(async (req, res) => {
  // get id of department from params to update
  const { id } = req.params;
  if (!id) throw new ApiError(400, "Pass the valid department id.");

  // Destructure essential fields
  const { name } = req.body;

  // Check require fileds
  if ([name].some((field) => field.trim() === ""))
    throw new ApiError(400, "Fill the required fields");

  // Check the already existence
  const existDepartment = await Department.findById(id);
  if (
    existDepartment.name ===
    name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase()
  )
    throw new ApiError(404, "Department name is already exists.");

  const updatedDepartment = await Department.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true }
  );
  if (!updatedDepartment)
    throw new ApiError(500, "Failed to update department in database.");

  // return response data of updated department
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Department updated successfully.",
        updatedDepartment
      )
    );
});

export {
  addDepartment,
  getDepartment,
  getAllDepartment,
  deleteDepartment,
  updateDepartment,
};
