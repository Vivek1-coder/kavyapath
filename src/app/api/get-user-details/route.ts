import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User.model";

export async function GET(request:Request) {
    try {
        await dbConnect();
            const session = await getServerSession(authOptions);
            if (!session || !session.user) {
                return new Response(
                    JSON.stringify({ success: false, message: "Not authenticated" }),
                    { status: 401 }
                );
            }
            const userId = new mongoose.Types.ObjectId(session.user._id);
    
            const { searchParams } = new URL(request.url);
            const username = searchParams.get('username');
            const user = await UserModel.find({name:username});
            if(!user){
                return new Response(
                    JSON.stringify({ success: false, message: "No user found" }),
                    { status: 404 }
                );
            }
    
            return new Response(
                JSON.stringify({ success:true, message: "User details fetched successfully",user:user }),
                { status: 201 }
            );
    
    } catch (error) {
        return new Response(
            JSON.stringify({ success:false, message: "Internal server error in getting userdetails" }),
            { status: 500 }
        );
    }
    
}