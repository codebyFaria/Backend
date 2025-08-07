import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const UserSchema = new Schema({

    userName: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },

      email: {
        type: String,
        required: true,
        lowercase: true,
    },

     FullName: {
        type: String,
        required: true,
        lowercase: true,
    },

     Avatar: {
        type: String,
    },

    CoverImage: {
        type: String,
    },

    Password: {
        type: String,
        required: true,
        minlength: 6
       
    },

    refreshToken: {
        type: String,
    },

    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],

},{timestamps: true});

UserSchema.pre("save", function(next){
    if(!this.isModified("Password")) return;

    this.Password = bcrypt.hash(this.Password,10)
    next();
})

UserSchema.methods.IsPasswordCorrect = async function(password){
 return  bcrypt.compare(password,this.password);
}

UserSchema.methods.AccessGeneratorToken = function(){
    jwt.sign(
        {
        _id : this._id,
        userName : this.userName,
        FullName : this.FullName,
        email : this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            experiesIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

UserSchema.methods.RefreshTokenGenerator = function(){
    jwt.sign(
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
} 

export const User = mongoose.model("User", UserSchema)