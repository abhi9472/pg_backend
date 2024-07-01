import { ApiError } from "../utils/ApeError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser =asyncHandler(async (req,res)=>{
    const{name,email,phoneNum,password,Username}=req.body

    // if(
    //     [name,email,phonenum,password,phoneNum].some((field)=>field.trim()==="")
    // )
    
    // {
    //     throw new ApiError(400,"All fields are required")
    // }
    const existeduser=await User.findOne({
        $or: [{ Username }, { email }]
    })

    if(existeduser)
    {
        throw new ApiError(401,"User already exist")

    }

    const avatarlocalpath=req.files?.avatar[0]?.path;

    if(!avatarlocalpath)
        {
            throw new ApiError(400,"Avatar is required")


        }
    const avatar=await uploadOnCloudinary(avatarlocalpath)
    if (!avatar)
    {
        throw new ApiError(400, "Avatar file is required")
    }
    const user=await User.create({
        name,
        email,
        avatar:avatar.url,
        phoneNum,
        password,
        Username:Username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
})

export {registerUser}