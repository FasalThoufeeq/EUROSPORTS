var express = require('express');
var router = express.Router();
const userControllers=require('../Controllers/userControllers/userControllers')
const userProductController=require('../Controllers/userControllers/userProductControllers')
const authentication=require('../authMiddleware/userAuth')


/* GET users listing. */
router.get('/',userControllers.getUserHome)

router.get('/login',userControllers.getUserLogin)

router.post('/login',userControllers.postLogin)

router.get('/logout',userControllers.getLogout)

router.get('/signup',userControllers.getSignup)

router.post('/signup',userControllers.postSignup)



router.get('/number',userControllers.getNumber)

router.post('/number',userControllers.postNumber)

router.get('/otp',userControllers.getOTP)

router.post('/otp',userControllers.postOtp)

router.get('/change-password',userControllers.getchangePass)

router.post('/change-password',userControllers.postchangePass)



router.get('/shop',userProductController.getShop)

router.get('/shop-details/:id',userProductController.getProductDetails)

router.get('/category-show/:id',userProductController.categoryShow)



router.get("/addToCart/:id",authentication.userAuthentication,userProductController.getAddToCart)

router.get('/cart',authentication.userAuthentication,userProductController.getCart)

router.put('/change-quantity',authentication.userAuthentication,userProductController.changeQuantity)

router.delete('/removeCart',authentication.userAuthentication,userProductController.removeCart)



router.get('/checkout',authentication.userAuthentication,userProductController.getcheckout)

router.post('/addAddress',authentication.userAuthentication,userProductController.addAddress)

router.post('/order',authentication.userAuthentication,userProductController.postOrder)

router.get('/orders',authentication.userAuthentication,userProductController.getOrders)

router.get('/order-details',authentication.userAuthentication,userProductController.getOrderDetails)

router.put('/cancelOrder/:id',authentication.userAuthentication,userProductController.cancelOrder)

router.put('/returnOrder/:id',authentication.userAuthentication,userProductController.returnOrder)



module.exports = router;
