import { time } from "console";
import mongoose, { Document, Schema, Model } from "mongoose";

// 1. Define an interface for User document
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "customer" | "admin" | "seller";
  isVerified: boolean;
}

// 2. Define a schema for User
const userSchema: Schema<IUser> = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin", "seller"],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 3. Create a model for User
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

// 4. Export the model
export default User;
