import { Promise } from "mongoose"

const asyncHandler =(requestHandler)=> (req,res,next)=>{
    Promise.resolve(requestHandler(req,res,next)).catch((err)=>(err))
}

export {asyncHandler}

