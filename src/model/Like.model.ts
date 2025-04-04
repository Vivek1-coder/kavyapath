import mongoose, { Schema, Document, model } from "mongoose";

export interface ILike extends Document {
  poemId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    poemId: { type: Schema.Types.ObjectId, ref: "Poem", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Like || model<ILike>("Like", LikeSchema);
