import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { addhome , allhomes, gethomedetail, getuserhome} from "../controllers/products.controllers.js";
import { updatelocation, updatePhoneNum, updateprice } from "../controllers/updatehome.controllers.js";

const router=Router()

// function test(){
//     console.log("ok");
//     return true;
// }

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

router.route("/addhome").post(verifyJwt, upload.fields([
    {
        name: "image",
    }, 
    
]),
    addhome
)
router.route("/allhomes").post(allhomes);
router.route("/getuserhome").post(verifyJwt,getuserhome);
router.route("/gethomedetail").get(gethomedetail);
// router.get('gethomedetail', gethomedetail);

router.route("/updateprice").patch(verifyJwt,updateprice);
router.route("/updatelocation").patch(verifyJwt,updatelocation);
router.route("/updatephone").patch(verifyJwt,updatePhoneNum);

export default router