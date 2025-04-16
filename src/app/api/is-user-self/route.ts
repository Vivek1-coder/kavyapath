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
            const user = await UserModel.findById(userId);
            const user2 = await UserModel.find({name:username})
            if(!user2){
                return new Response(
                    JSON.stringify({ success: false, message: "No user found" }),
                    { status: 404 }
                );
            }
            
            if(user.name !== username){
                return new Response(
                    JSON.stringify({ success:true, message: "Not Same" }),
                    { status: 201 }
                );
            }
            else{
                return new Response(
                    JSON.stringify({ success:true, message: "Same"}),
                    { status: 201 }
                );
            }
            
    } catch (error) {
        return new Response(
            JSON.stringify({ success:false, message: "Internal server error in getting userdetails" }),
            { status: 500 }
        );
    }
}