import mongoose from "mongoose";
const { Schema } = mongoose;


import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema =new Schema(
    {
        Username:{
            type:String,
            unique:true,
            required:true,
            lowercase:true,
            trim:true,
            index:true

        },
        email:{
            type:String,
            unique:true,
            required:true,
            // lowercase:true,
            trim:true,
            index:true

        },
        name:{
            type:String,
            // unique:true,
            required:true,
            // lowercase:true,
            trim:true,
            index:true

        },
        avatar:{
            type:String,
            required:true,
            default: process.env.DEFAULT_AVATAR_USER_SCHEMA
        },
        password:{
            type:String,
            required:true,


        },
        refreshToken:{
            type:String,

        }
        ,
        phoneNum:{
            type:Number,
            required:true
        },
        role: {
             type: String,
              enum: ['user', 'admin'],
              default: 'user' 
        }


    },
    {
        timestamps:true
    }

)


userSchema.pre("save", async function(next)
{
    if(!this.isModified("password")) return next;
    this.password=await bcrypt.hash(this.password,10)
    next()
})
// userSchema.methods.isPasswordCorrect=async function(password){
//     return await bcrypt.compare(password,this.password)

// }
// userSchema.methods.isPasswordCorrect = async function(password){
//     return await bcrypt.compare(password, this.password)
// }
userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = function(){
    console.log(process.env.ACCESS_TOKEN_SECRET);
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema)
