import mongoose, { Schema, Document, model } from "mongoose";

export interface Poem extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  category: string;
  createdAt: Date;
}

const PoemSchema = new Schema<Poem>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Poem || model<Poem>("Poem", PoemSchema);
