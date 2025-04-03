import nodemailer from "nodemailer";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationOtp(email:string,
    username:string,
    verifyCode:string):Promise<ApiResponse> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // True for port 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Your Name" <${process.env.SMTP_USER}>`,
      to: email,
     subject: 'Exam Buddy | Verification code',
     text : `Hello ${username}, your verification code for XamBuddy is ${verifyCode}`
    };

    await transporter.sendMail(mailOptions);

    return {success:true,message:"Verification email send successfully"}
  } catch (error) {
    console.error("Error sending verification email",email,error)
        return {success:false,message:'Failed to send verification email'}
  }
}
