import { Router } from "express";
import { loginUser, logoutUser, registerUser, userdetail } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { addhome , allhomes, gethomedetail, getuserhome} from "../controllers/products.controllers.js";
import { updateavatar, updatelocation, updatePhoneNum, updateprice } from "../controllers/updatehome.controllers.js";

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

    router.post("/updateavatar", verifyJwt,isAdmin, upload.single('avatar'), updateavatar);



router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt,logoutUser)

router.route("/addhome").post(verifyJwt,isAdmin, upload.fields([
    {
        name: "image",
    }, 
    
]),
    addhome
)
router.route("/userdetail").post(verifyJwt,isAdmin,userdetail);
router.route("/allhomes").post(allhomes);
router.route("/getuserhome").post(verifyJwt,isAdmin,getuserhome);
router.route("/gethomedetail").get(gethomedetail);
// router.get('gethomedetail', gethomedetail);

router.route("/updateprice").patch(verifyJwt,isAdmin,updateprice);
router.route("/updatelocation").patch(verifyJwt,isAdmin,updatelocation);
router.route("/updatephone").patch(verifyJwt,isAdmin,updatePhoneNum);

export default router