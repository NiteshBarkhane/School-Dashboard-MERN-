import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Class is required."],
    unique: true,
    uppercase: true,
    trim: true,
  },
  section: [
    {
      type: String,
      require: [true, "Section is required."],
      uppercase: true,
      trim: true,
    },
  ],
  subject: [
    {
      type: String,
      trim: true,
      set: capitalizeFirstChar,
    },
  ],
});

function capitalizeFirstChar(value) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export const Class = mongoose.model("Class", classSchema);
