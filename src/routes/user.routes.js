import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addProducts } from "../controllers/products.controllers.js";

const router=Router()

function test(){
    console.log("ok");
    return true;
}

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
       
    ]),
    registerUser
    )

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt,logoutUser)

router.route("/addProducts").post(verifyJwt, upload.fields([
    {
        name: "image",
    }, 
    
]),
    addProducts
)

export default router