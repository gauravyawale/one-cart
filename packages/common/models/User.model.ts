import mongoose, { Document, Schema, Model } from 'mongoose';
import { UserRole } from '../types/enums/User.enums';
// 1. Define an interface for User document
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
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
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// 3. Create a model for User
export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
