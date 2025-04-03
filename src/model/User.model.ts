import mongoose, { Schema, Document, model } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String },
    bio: { type: String },
    verifyCode: {
      type: String,
      required: [true, "Verification code is required"],
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true, "verify Code Expiry is required"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || model<User>("User", UserSchema);
