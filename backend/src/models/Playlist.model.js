import mongoose,{Schema} from 'mongoose'

const PlaylistSchema = new Schema({

    name:{
        type:String,
        required:true,
        Lowercase:true,
    },

    description:{
        type:String,
        required:true,
    },

    videos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }


},{timestamps:true})

export const Playlist = mongoose.model(" Playlist",PlaylistSchema)