import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import PoemModel from "@/model/Poem.model";


export async function GET(request:Request){
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const poemId = searchParams.get("poemId");
        
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new Response(
                JSON.stringify({ success: false, message: "Not authenticated" }),
                { status: 401 }
            );
        }
        
        const userId = new mongoose.Types.ObjectId(session.user._id);

        const poem = await PoemModel.findOne({
            poemId: new mongoose.Types.ObjectId(poemId as string),
            author:userId
        });

        if (!poem) {
            return new Response(
                JSON.stringify({ success: true, message: "Not Author" }),
                { status: 200 }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: "Author" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user status",error)
        return new Response(
            JSON.stringify({ success: false, message: "Internal server error while getting user status" }),
            { status: 500 }
        );
    }
}