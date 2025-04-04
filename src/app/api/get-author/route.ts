import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import CommentModel from '@/model/Comment.model'; // adjust path as needed
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User.model';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId');

    if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or missing authorId',
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findById(authorId);
     
    if(!user){
        return NextResponse.json(
            {
              success: false,
              message: 'Invalid or missing author',
            },
            { status: 404}
          );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Comments fetched successfully',
        username: user?.name || 'Unknown',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching comments',
      },
      { status: 500 }
    );
  }
}
