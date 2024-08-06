import mongoose  from "mongoose";
import { User } from "./user.model.js";
import { userdetail } from "../controllers/user.controller.js";

const {Schema}=mongoose

// import jwt from 'jsonwebtoken'
// import bycrpyt from 'bcrypt'

const productSchema=new Schema(
    {
        size:
        {
            type:String,
            required:true,
            lowercase:true,
            trim:true

        },
        price:
        {
            type:String,
            required:true
        },
        image:
        {
            type:[String],
            required:true
        },

        washroom:
        {
            type:String,
            enum:['attached','not-attached'],
            default:'not-attached'

        },
        floor:
        {
            type:String,
            enum:['1','2','3','4','5'],
            default:'1'

        },
        phoneNum:{
            type:Number,
            required:true
        },
        
        lift:
        {
            type:String,
            enum:['Yes','No'],
            default:'No'
        },
        location:
        {
            type:String,
            required:true,
            trim:true,
            lowercase:true
        },
        Co_ed:
        {
            type:String,
            enum:['Yes','No'],
            trim:true,
            required:true,
            default:'No'

        },
        uploader: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }
    ,{
        timestamps:true
    }
)

// userSchema.pre('save',async function(next){
//     if(!this.password=password)
// })

export const Products=mongoose.model("Products",productSchema)

export const Uploader=mongoose.model("Uploader",productSchema);



