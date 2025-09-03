import mongoose,{Schema} from 'mongoose'

const CommentSchema = new Schema({
 
    content:{
        type:String,
        required:true,
    },

    video:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video",
    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

export const Comment = mongoose.model("Comment",CommentSchema )