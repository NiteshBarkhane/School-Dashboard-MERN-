import mongoose from "mongoose";

const departmentSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Department is required."],
    unique: true,
    trim: true,
    set: capitalizeFirstChar
  },
});

function capitalizeFirstChar(value){
  if(!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

export const Department = mongoose.model("Department", departmentSchema);
