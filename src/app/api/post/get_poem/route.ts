
import dbConnect from '@/lib/dbConnect';
import PoemModel from '@/model/Poem.model';

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

    const poem = await PoemModel.findById(poemId);

    return Response.json(
        {
            success:true,
            message:"New like added successfully.",
            poem : poem
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
