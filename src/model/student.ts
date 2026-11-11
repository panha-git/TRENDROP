import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1, max: 120 },
    gender: {
      type: String,
      required: true,
      enum: ["Female", "Male", "Non-binary", "Prefer not to say"],
    },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordSalt: { type: String, required: true, select: false },
    passwordHash: { type: String, required: true, select: false },
    //     phone: { type: String, required: true, trim: true },
    //     address: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const Student =
  mongoose.models.Student || mongoose.model("Student", schema);
