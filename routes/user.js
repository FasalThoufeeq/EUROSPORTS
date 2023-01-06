const { Router } = require("express");
var express = require("express");
var router = express.Router();
const userController=require("../controllers/usercontroller/usercontroller");
const userProductController=require("../controllers/usercontroller/userProductController");
const authentication=require("../middleware/authentication")

/* GET home page. */
router.get("/", userController.getUserHome);

router.get("/signup", userController.getUserSignUp);

router.post("/signup", userController.postUserSignUp);

router.get("/login",authentication.userAuthentication, userController.getUserLOgin);

router.post("/login", userController.postUserlogin);

router.get("/logout",userController.getLogout);





router.get("/cart",userProductController.getUserCart);

router.get("/add_to_cart/:id")






router.get("/get_number",userController.getNumber);

router.post("/get_number",userController.postNumber)

router.get("/otp",userController.getOTP)

router.post("/otp",userController.postOtp)




router.get("/shop", userProductController.getUserShop);

router.get("/product_single_view/:id",userProductController.getSingleView);







module.exports = router;
