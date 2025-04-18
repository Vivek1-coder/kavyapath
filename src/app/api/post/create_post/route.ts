import dbConnect from "@/lib/dbConnect";
import PoemModel from "@/model/Poem.model";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function POST(request:Request) {
    await dbConnect();

        const {title,content,category} = await request.json();
        if(!title || !content || !category){
            return Response.json(
                {
                    success : false,
                    message:"All fields are required"
                },
                { status : 404}
            )
        }
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
        
        try{
            const newSubject = new PoemModel({
                title,
                content,
                author:userId,
                category,
                likes:0
            })
            await newSubject.save();
            
            return Response.json(
                {
                    success:true,
                    message:"Poem published successfully."
                },
                {
                    status:200
                }
            )

    } catch (error) {
        console.error('Error in publishing poem', error);
        return Response.json(
          {
            success: false,
            message: 'Error in publishing poem',
          },
          { status: 500 }
        );
      }
    }