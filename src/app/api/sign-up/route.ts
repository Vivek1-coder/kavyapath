import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";

export async function POST(request:Request) {
    await dbConnect()

    try{
        const{ username,email,password } = await request.json();
    
        const existingUserByUsername = await UserModel.findOne({
            name: username,
        });

        if(existingUserByUsername){
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

        if(existingUserByEmail){
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

        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new UserModel({
            name:username,
            email,
            password: hashedPassword,
            isVerified: true,
        });

        await newUser.save();

        return Response.json(
            {
                success: true,
                message: 'User registered successfully. You can now sign in.',
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


