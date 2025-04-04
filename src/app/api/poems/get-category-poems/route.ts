// File: /src/app/api/post/get_poems_by_category/route.ts


import dbConnect from "@/lib/dbConnect";
import PoemModel from "@/model/Poem.model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json({ error: "Category is required" }, { status: 400 });
    }

    const poems = await PoemModel.find({ category }).sort({ createdAt: -1 }).populate("author", "name");

    return NextResponse.json({ poems }, { status: 200 });
  } catch (error) {
    console.error("Error fetching poems by category:", error);
    return NextResponse.json({ error: "Failed to fetch poems by category" }, { status: 500 });
  }
}
