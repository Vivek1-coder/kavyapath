import mongoose, { Schema, Document, model } from "mongoose";

export interface IComment extends Document {
  poemId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    poemId: { type: Schema.Types.ObjectId, ref: "Poem", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Comment || model<IComment>("Comment", CommentSchema);
