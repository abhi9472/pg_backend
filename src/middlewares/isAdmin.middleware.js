import mongoose from "mongoose";

import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApeError.js";

export const isAdmin=asyncHandler(async(req,res,next)=>{
    
    if(req.user && req.user.role=='admin')
        {
            next();
        }
    else{
        throw new ApiError(401,"Admin can only perform operation");
    }
})

// module.exports=isAdmin