import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import LikeModel from '@/model/Like.model';
import dbConnect from '@/lib/dbConnect';

export async function GET(request:Request) {
  try {
    await dbConnect(); // ensures DB connection

    const { searchParams } = new URL(request.url);
    const poemId = searchParams.get("poemId");

    if(!poemId){
        return Response.json(
            {
                success : false,
                message:"Poem Id not available"
            },
            { status : 404 }
        )
    }

    const totalLikes = await LikeModel.countDocuments({ poemId });

    return Response.json(
        {
            success:true,
            message:"New like added successfully.",
            likes: totalLikes
        },
        {
            status:200
        }
    )
  } catch (error) {
    console.error('Error in getting likes ', error);
        return Response.json(
          {
            success: false,
            message: 'Error in getting likes',
          },
          { status: 500 }
        );
      }
    }
