const { Router } = require("express");
var express = require("express");
const productController = require("../controllers/admincontroller/productController");
var router = express.Router();
const userController=require("../controllers/usercontroller/usercontroller");
const userProductController=require("../controllers/usercontroller/userProductController");
const authentication=require("../middleware/authentication")

/* GET home page. */
router.get("/", userController.getUserHome);

router.get("/signup", userController.getUserSignUp);

router.post("/signup", userController.postUserSignUp);

router.get("/login", userController.getUserLOgin);

router.post("/login", userController.postUserlogin);

router.get("/logout",userController.getLogout);





router.get("/get_number",userController.getNumber);

router.post("/get_number",userController.postNumber)

router.get("/otp",userController.getOTP)

router.post("/otp",userController.postOtp)





router.get("/shop", userProductController.getUserShop);

router.get("/product_single_view/:id",userProductController.getSingleView);



// router.use(authentication.userAuthentication)



router.get("/cart",authentication.userAuthentication,userProductController.getUserCart);

router.get("/add_to_cart/:id",authentication.userAuthentication,userProductController.getAddToCart)

router.get("/checkout_page",authentication.userAuthentication,userProductController.getCheckoutPage)

router.get("/addAddress",authentication.userAuthentication,userProductController.getAddAdress)

router.post("/addAddress",authentication.userAuthentication,userController.postAddress)

router.put("/change_quantity",authentication.userAuthentication,userProductController.changeQauntity)

router.delete("/remove_cart",authentication.userAuthentication,userProductController.removeCart)

router.get("/payment_successful",authentication.userAuthentication,userProductController.paySuccess)

router.post("/orders",authentication.userAuthentication,userProductController.postOrders)

router.get("/orders",authentication.userAuthentication,userProductController.getOrders)

router.get("/order_details",authentication.userAuthentication,userProductController.getOrderDetails)








module.exports = router;
