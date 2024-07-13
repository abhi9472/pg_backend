import { ApiError } from "../utils/ApeError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";


async function generateAccessRefreshToken(id){
    try {
        const user = await User.findOne(id).select("-password");
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
    
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(401, `${error.message}`);
    }
}

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
    

    const user=await User.findOne({
        $or:[{Username},{email}]
    })

    if(!user)
        {
            throw new ApiError(400,"user doesnot exist")
        }
    console.log(user);
    const checkpass=await user.comparePassword(password);

    if(!checkpass)
        {
            throw new ApiError(400,"Password is wrong")
        }
    const loginUser=await User.findById(user._id).select("-password -refreshToken")
    const options={
        httpOnly:true,
        secure:true
    }

    const { accessToken, refreshToken } = await generateAccessRefreshToken(loginUser._id);
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loginUser }, "User logged in successfully")
);
})


const logoutUser=asyncHandler(async(req,res)=>{
    const user = await User.findByIdAndUpdate(
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
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,user,"user log Out Done")
       
    )
})



export { registerUser,loginUser,logoutUser }