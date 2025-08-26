import mongoose,{Schema} from 'mongoose'

const TweetSchema = new Schema({

content:{
    type:String,
    required:true
},

video:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Video"
},

owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}

},{timestamps:true})

export const Tweet = mongoose.model("Tweet", TweetSchema)