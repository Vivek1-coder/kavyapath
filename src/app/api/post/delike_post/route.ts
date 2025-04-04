import dbConnect from "@/lib/dbConnect";
import LikeModel from "@/model/Like.model";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(request:Request) {
    await dbConnect();

    const session = await getServerSession(authOptions)
    const user:User = session?.user as User

    if(!session || !session.user){
        return Response.json(
            {
                success : false,
                message:"Not Authentication"
            },
            { status : 401 }
        )
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    
    const { searchParams } = new URL(request.url);
    const poemId = searchParams.get("poemId");

        try{

            LikeModel.findOneAndDelete({poemId,userId})
            
            return Response.json(
                {
                    success:true,
                    message:"New like added successfully."
                },
                {
                    status:200
                }
            )

    } catch (error) {
        console.error('Error in liking', error);
        return Response.json(
          {
            success: false,
            message: 'Error in liking',
          },
          { status: 500 }
        );
      }
    }