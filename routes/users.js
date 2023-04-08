var express = require("express");
var router = express.Router();
const userControllers = require("../Controllers/userControllers/userControllers");
const userProductController = require("../Controllers/userControllers/userProductControllers");
const authentication = require("../authMiddleware/userAuth");
const isBlock = require("../authMiddleware/blockAuth");

/* GET users listing. */
router.get("/", userControllers.getUserHome);

router.get("/login", userControllers.getUserLogin);

router.post("/login", userControllers.postLogin);

router.get("/logout", userControllers.getLogout);

router.get("/signup", userControllers.getSignup);

router.post("/signup", userControllers.postSignup);

router.get("/number", userControllers.getNumber);

router.post("/number", userControllers.postNumber);

router.get("/otp", userControllers.getOTP);

router.post("/otp", userControllers.postOtp);

router.get("/change-password", userControllers.getchangePass);

router.post("/change-password", userControllers.postchangePass);

router.get(
  "/user-profile",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userControllers.getProfile
);

router.put(
  "/update_profile/:id",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userControllers.updateProfile
);

router.post(
  "/reset-password",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userControllers.resetPassword
);

router.get(
  "/getAddress",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userControllers.getAddress
);

router.post(
  "/post-Address",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userControllers.postAddress
);

router.delete(
  "/delete-address",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userControllers.deleteAddress
);

router.get("/shop", userProductController.getShop);

router.get("/shop-details/:id", userProductController.getProductDetails);

router.get("/category-show/:id", userProductController.categoryShow);

router.post("/sort", userProductController.postSort);

router.get(
  "/addToCart/:id",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.getAddToCart
);

router.get(
  "/cart",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.getCart
);

router.put(
  "/change-quantity",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.changeQuantity
);

router.delete(
  "/removeCart",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.removeCart
);

router.get(
  "/addWishlist/:id",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.addWishList
);

router.get(
  "/get-wishlist",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.getWishlist
);

router.delete(
  "/remove-wishlist",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.removeWishlist
);

router.get(
  "/checkout",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.getcheckout
);

router.post(
  "/addAddress",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.addAddress
);

router.post(
  "/check_out",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.postOrder
);

router.post(
  "/verify_payment",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.verifyPayment
);

router.get(
  "/order_success",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.orderSuccess
);

router.get(
  "/orders",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.getOrders
);

router.get(
  "/order-details",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.getOrderDetails
);

router.put(
  "/cancelOrder/:id",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.cancelOrder
);

router.put(
  "/returnOrder/:id",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.returnOrder
);

router.post(
  "/cart",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.postCart
);

router.post(
  "/validate-coupon",
  authentication.userAuthentication,
  isBlock.isBlocked,
  userProductController.validateCoupon
);

router.post("/search", userProductController.postSearch);

module.exports = router;
