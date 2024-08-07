import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApeError.js"; 
import { Products } from "../models/product.model.js";
import fs from 'fs';
import mongoose from "mongoose";
const addhome = asyncHandler(async (req, res) => {
  const { location, size, lift, floor, Co_ed, price,washroom } = req.body;
  const uploader = req.user._id;
  const name=req.user.name;
//   console.log(name);
    const phoneNum=req.user.phoneNum;

  if (req.files.length === 0) {
    throw new ApiError(400, "Please upload images");
  }

// console.log(Array.isArray(req.files));

  let imageUrls = [];
//   console.log(req.files.image);
for(let i = 0; i < req.files.image.length; i++){
    const files = req.files.image[i].path;
    const result = await uploadOnCloudinary(files);
    // console.log(result);
    imageUrls.push(result.url);
}
// console.log(imageUrls);
const image = imageUrls
// console.log(image);
  const newProduct = {
    image, // Save the URLs of the uploaded images
    location: location.toLowerCase(),
    size,
    floor,
    phoneNum,
    lift,
    Co_ed,
    price,
    washroom,
    uploader,
    name
  };

  try {
    const product = await Products.create(newProduct);

    // Add product reference to user
    // console.log(product);
    await User.findByIdAndUpdate(req.user._id, { $push: { products: product._id } });

    return res.status(200).json({ message: "Images added successfully", product });
  } catch (error) {
    throw new ApiError(500, "Error in creating product", error);
  }
});

const allhomes=asyncHandler(async(req,res)=>{
    try {
        const homes=await Products.find().populate({
            path:'uploader',
            select:' -password -refreshToken'
        }).lean().exec();
        // homes.info.reverse();
        // homes.data=homes.data.reverse();
        // console.log(homes.reverse());
        homes.reverse();
        res.json(homes);
    } catch (error) {
        throw new ApiError(400,"No Products available");
        
    }
})

const getuserhome=asyncHandler(async(req,res)=>{
    const user=req.user._id;


    try {
        const homes=await Products.find({uploader:user});
        if (homes.length === 0) {
            return res.status(404).json({ message: "No Homes available" });
          }

        return res.status(200).json(homes);

        
    } catch (error) {
        return res.status(500).json({message:error.message})
        
    }


})

const gethomedetail = asyncHandler(async (req, res) => {
    const imageid = req.query._id;
  
    try {
      const imageobj = await Products.findById(new mongoose.Types.ObjectId(String(imageid))).populate({
        path:'uploader',
        select:' -password -refreshToken'


      }).lean().exec();
  
      if (!imageobj) {
        throw new ApiError(404, "Details not found");
      }
  
      return res.status(200).json(imageobj);
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
  });


  


export { addhome ,allhomes,getuserhome,gethomedetail};