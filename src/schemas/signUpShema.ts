import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters")
  .max(20, "Username should be no more than 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username should not contain special characters");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  profilePicture: z.string().url().optional(), // Optional profile picture URL
  bio: z.string().max(200, "Bio must be at most 200 characters").optional(), // Optional bio
});
