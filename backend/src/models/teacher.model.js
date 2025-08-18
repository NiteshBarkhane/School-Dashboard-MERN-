import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
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
    qualification: [
      {
        type: String,
        required: [true, "Qualifications are required"],
        trim: true,
      },
    ],
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
    about: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    department: [
      {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Department",
        type: String,
        trim: true,
      },
    ],
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

export const Teacher = mongoose.model("Teacher", teacherSchema);
