import mongoose,{Schema,Document} from "mongoose";  


export interface Follow extends Document{
    followerId:mongoose.Schema.Types.ObjectId,
    followingId:mongoose.Schema.Types.ObjectId,
    createdAt:Date
}

const FollowSchema: Schema<Follow> = new Schema({
    followerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    followingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    
    createdAt:{
        type:Date,
        default:Date.now(),
        required:true
    }
})

const FollowModel = (mongoose.models.Follow as mongoose.Model<Follow>) || (mongoose.model<Follow>("Follow",FollowSchema))

export default FollowModel;
