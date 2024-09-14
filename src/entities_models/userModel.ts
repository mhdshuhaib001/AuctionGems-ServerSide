import mongoose, { Schema, model } from "mongoose";
import { User } from "../interfaces/model/user";
const userSchema = new Schema<User>({
  name: {
      type: String,
      required: true,
  },
  email: {
      type: String,
      required: true,
      unique: true,
  },
  password: {
      type: String,
      required: true,
  },
  phoneNo: {
      type: Number,
  },
  isSeller: {
      type: Boolean,
      default: false,
  },
  otp: {
      type: String,
  },
  isActive: {
      type: Boolean,
      default: false,
  },
  role: {
      type: String,
      enum: ['user', 'seller'],
      default: 'user',
  },
});


export const UserModel = model<User>("User", userSchema);
