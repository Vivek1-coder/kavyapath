import dbConnect from "@/lib/dbConnect";

import UserModel from "@/model/User.model";

export async function GET(request:Request) {
    try {
        await dbConnect();
    
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
        console.log(error);
        return new Response(
            JSON.stringify({ success:false, message: "Internal server error in getting userdetails"}),
            { status: 500 }
        );
    }
    
}