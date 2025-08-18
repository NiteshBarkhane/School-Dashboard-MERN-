import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "Father name is required"],
      trim: true,
    },
    motherName: {
      type: String,
      required: [true, "Mother name is required"],
      trim: true,
    },
    class: {
      type: String,
      required: [true, "Class is required"],
    },
    section: {
      type: String,
      required: [true, "Section is required"],
    },
    dob: {
      type: String,
      required: [true, "Dob are required"],
      trim: true,
    },
    gender: {
      type: String,
      default: "",
    },
    bloodGroup: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    authData: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Student = mongoose.model("Student", studentSchema);
