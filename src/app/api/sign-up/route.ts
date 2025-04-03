import { sendVerificationOtp } from "@/helpers/sendVerificationOtp";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";

// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request) {
    await dbConnect()

    try{
        const{ username,email,password } = await request.json();
    
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified:true,
        });

        if(existingVerifiedUserByUsername){
            return Response.json(
                {
                    success:false,
                    message:"Username is already taken"
                },{
                    status:400
                }
            );
        }

        const existingUserByEmail = await UserModel.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success:false,
                        message:"User already exists with this email"
                    },
                    {
                        status:400
                    }
                )
            }
            else{
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date(Date.now() + 3600000);
            expiryDate.setHours(expiryDate.getHours()+1);

             const newUser = new UserModel({
                name:username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
            });

            await newUser.save();
    }
    // const serviceId = process.env.EMAILJS_SERVICEID || '';
    // const templateId = process.env.EMAILJS_TEMPLATEID || '';
    // const publicKey = process.env.EMAILJS_PUBLIC_KEY || '';
   

    // const emailData = {
    //     service_id: serviceId,
    //     template_id: templateId,
    //     user_id: publicKey, // Public key (client-side)
    //     template_params: { username:username,
    //         otp:verifyCode },
    //   };
    const emailResponse = await sendVerificationOtp(
        email,
        username,
        verifyCode
    )
    if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }

      return Response.json(
        {
          success: true,
          message: 'User registered successfully. Please verify your account.',
        },
        { status: 201 }
      );


    }catch(error){
        console.error('Error registering user:', error);
    return Response.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 }
    );
        
    }
}


