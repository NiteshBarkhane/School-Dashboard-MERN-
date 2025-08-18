import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
  },
  time: {
    type: String,
    required: [true, "Timing is required."],
  },
  day: [
    {
      type: String,
      required: [true, "Day is required."],
    },
  ],
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
    required: [true, "Class is required."],
  },
  section: [
    {
      type: String,
      required: [true, "Section is required"],
    },
  ],
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: [true, "Teacher is required."],
  },
  subject: {
    type: String,
    required: [true, "Subject is required."],
  },
});

export const Schedule = mongoose.model("Schedule", scheduleSchema);
