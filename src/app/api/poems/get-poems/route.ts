// File: /src/app/api/post/get_all_poems/route.ts

import dbConnect from "@/lib/dbConnect";
import PoemModel from "@/model/Poem.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const poems = await PoemModel.find().sort({ createdAt: -1 }).populate("author", "name");
    return NextResponse.json({ poems }, { status: 200 });
  } catch (error) {
    console.error("Error fetching all poems:", error);
    return NextResponse.json({ error: "Failed to fetch poems" }, { status: 500 });
  }
}
