import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1, max: 120 },
    email: { type: String, required: true, unique: true, trim: true },
    //     phone: { type: String, required: true, trim: true },
    //     address: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const Student =
  mongoose.models.Student || mongoose.model("Student", schema);
