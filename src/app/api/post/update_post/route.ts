import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function PUT(request:Request){
    await dbConnect();

    const session = await getServerSession(authOptions)
        const user:User = session?.user as User

        if(!session || !session.user){
            return Response.json(
                {
                    success : false,
                    message:"Not Authenticated"
                },
                { status : 401 }
            )
        }
    
    const userId = new mongoose.Types.ObjectId(user._id)
    const { searchParams } = new URL(request.url);
    const poemId = searchParams.get("poemId");
    const {title,content,category} = await request.json()
    if(!poemId){
        return Response.json(
            {
                success:false,
                message:"Subject Id not present"
            },
            {
                status:404
            }
        )
    }

    try {
        const result = await mongoose.model('Poem').findById(poemId)
        if (!result || result.author.toString() !== userId.toString()) {
            return Response.json(
            {
                success: false,
                message: "Poem not found or you are not authorized to update this subject"
            },
            {
                status: 404
            }
            );
        }

        await mongoose.model('Poem').findByIdAndUpdate(poemId,{title:title,content:content,category:category})
        
        return Response.json(
            {
                success:true,
                message:"Subject Updated successfully",
                
            },{
                status:200
            }
        )
    } catch (error) {
        console.error('Error in updating subject',error);
        return Response.json(
            {
                success: false,
            message: 'Error in updating subject',
          },
          { status: 500 }
        );
      }
    }