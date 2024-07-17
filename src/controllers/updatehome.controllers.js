import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Products } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApeError.js";

const updateprice=asyncHandler(async(req,res)=>{
    const homeid=req.query.id;
    const {newPrice}=req.body;

    try {
        // const home=Products.findById(homeid);
        const home = await Products.findByIdAndUpdate(
            homeid,
            { price: newPrice },
            { new: true } // This option returns the updated document
        );

        if(!home)
            {
                throw new ApiError(401,"Home not exist");
            }

    //    home.price=newPrice;
    //    await home.save

        return res.status(200).json(new ApiResponse(200,"price updated"));
        
    } catch (error) {
        return res.status(500).json({message:error.message});
        
    }


})

// const updatelocation=asyncHandler(async(req,res)=>{
//     const{oldlocation,newlocation}=req.body;

//     const user=req.user._id;
//     try {

        
        
//     } catch (error) {
        
//     }
// })

export {updateprice};