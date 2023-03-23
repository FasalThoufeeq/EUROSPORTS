var express = require('express');
var router = express.Router();
const adminController=require('../Controllers/adminControllers/adminController')
const adminUser=require('../Controllers/adminControllers/adminUser')
const adminProduct=require('../Controllers/adminControllers/adminProductController')
const upload=require('../utils/multer')
const authentication=require('../authMiddleware/adminAuth')

/* GET home page. */
router.get('/',adminController.getDashboard)



router.get('/admin-login',adminController.getAdminLogin)

router.post('/admin-login',adminController.postAdminLogin)

router.get('/admin-logout',adminController.getAdminLogout)



router.get('/view-users',authentication.adminAuthentication,adminUser.getUserView)

router.get("/block_users/:id",authentication.adminAuthentication,adminUser.getUserBlock);

router.get('/unblock_users/:id',authentication.adminAuthentication,adminUser.getUserUnblock)



router.get('/add-category',authentication.adminAuthentication,adminProduct.getAddCategory)

router.post('/add-category',authentication.adminAuthentication,adminProduct.postCategory)

router.get('/edit-category/:id',authentication.adminAuthentication,adminProduct.getEditCategory)

router.post('/edit-category/:id',authentication.adminAuthentication,adminProduct.postEditcategory)

router.get('/delete-category/:id',authentication.adminAuthentication,adminProduct.deleteCategory)



router.get('/add-products',authentication.adminAuthentication,adminProduct.addproduct)

router.post('/add-products',authentication.adminAuthentication,upload.array('image',4) ,adminProduct.postAddProduct)

router.get('/view-products',authentication.adminAuthentication,adminProduct.viewProduct)

router.get('/edit-product/:id',authentication.adminAuthentication,adminProduct.getEditProduct)

router.post('/edit-product/:id',authentication.adminAuthentication,upload.array('image',4) ,adminProduct.postEditProduct)

router.get('/unlist-product/:id',authentication.adminAuthentication,adminProduct.unlistProduct)

router.get('/list-product/:id',authentication.adminAuthentication,adminProduct.listProduct)

router.get('/orders-list',authentication.adminAuthentication,adminProduct.getOrdersList)

router.get('/order-details/:id',authentication.adminAuthentication,adminProduct.getOrderDetails)

router.post('/order-details/:id',authentication.adminAuthentication,adminProduct.postOrderDetails)

module.exports = router;
