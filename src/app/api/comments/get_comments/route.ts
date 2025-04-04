import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import CommentModel from '@/model/Comment.model'; // adjust path as needed
import dbConnect from '@/lib/dbConnect';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const poemId = searchParams.get('poemId');

    if (!poemId || !mongoose.Types.ObjectId.isValid(poemId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or missing poemId',
        },
        { status: 400 }
      );
    }

    const comments = await CommentModel.find({ poemId })
      .populate('userId', 'name') // only populate name field of user
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        message: 'Comments fetched successfully',
        comments,
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
