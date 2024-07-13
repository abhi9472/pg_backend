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
const loginUser=asyncHandler(async(req,res)=>{
    console.log("inside controller");
    const {Username,email,password}=req.body

    if (!Username && !email) {
        throw new ApiError(400, "username or email is required")
    }
    

    const user=User.findOne({
        $or:[{Username},{email}]
    })

    if(!user)
        {
            throw new ApiError(400,"user doesnot exist")
        }
    console.log(user);
    const checkpassword=await user.isPasswordCorrect(password);

    if(!checkpassword)
        {
            throw new ApiError(400,"Password is wrong")
        }
    const loginUser=await User.findById(user._id).select("-password -refreshToken")
    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accesToken",accesToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,{

                user:loginUser,accesToken,refreshToken

            },
            "User loged in successfully"
        )
    )
})

const logoutUser=asyncHandler(async(req,res)=>{
    await user.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }

        },
        {
            new:true
        }

    )
    const options = 
    {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accesToken",accesToken,options)
    .clearCookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{},"user log Out Done")
       
    )
})



export {registerUser,loginUser,logoutUser}