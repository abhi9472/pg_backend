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

const updatelocation=asyncHandler(async(req,res)=>{

    const locationid=req.query.id;
    const{newlocation}=req.body;

    // const user=req.user._id;
    try {
        const homes=await Products.findByIdAndUpdate(
            locationid,
                {location:newlocation},
                {new:true}
        )

        if(!homes)
            {
                return new ApiResponse(401,"No Homes available to update location");
            }

        return res.status(200).json(
            200,
            {},
            "new location updated"
        )


    } catch (error) {
        return res.status(500).json({message:error.message});
        
    }
})

 const updatePhoneNum=asyncHandler(async (req,res)=>{
    const id=req.user._id;
    const {newnumber}=req.body;
    try {
        const home=await User.findByIdAndUpdate(
            id,
                {phoneNum:newnumber},
                {
                    new:true
                }
        )

        if(!home)
            {
                return res.status(401,"No user is available to change number");
            }
            return res.status(200).json(new ApiResponse(200, "Number changed successfully", User));
        } catch (error) {
        return res.status(500).json({message:error.message});
        
    }
 })

export {updateprice,updatelocation,updatePhoneNum};