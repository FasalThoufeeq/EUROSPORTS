var express = require("express");
const admincontroller = require("../controllers/admincontroller/admincontroller");
const adminUser=require("../controllers/admincontroller/adminUser");
const product=require("../controllers/admincontroller/adminCategory");
const adminCategory = require("../controllers/admincontroller/adminCategory");
const viewProduct=require("../controllers/admincontroller/productController");
const productController = require("../controllers/admincontroller/productController");
const multer=require("multer");
const multerUploads=require("../multer/multer")
const authentication=require("../middleware/authentication")
var router = express.Router();




router.get("/",authentication.adminAuthentication,admincontroller.getDashboard);

router.get("/login",admincontroller.getAdminLogin);

router.post("/login",admincontroller.postAdminLogin);

router.get("/logout",admincontroller.getAdminLogout);

router.use(authentication.adminAuthentication);

router.get("/view_users",adminUser.getUserView);

router.get("/block_users/:id",adminUser.getUserBlock);

router.get("/unblock_users/:id",adminUser.getUserUnblock);

router.get("/add_category",adminCategory.getCategory);

router.post("/add_category",adminCategory.postCategory);

router.get("/edit_category/:id",adminCategory.editCategory);

router.post("/edit_category/:id",adminCategory.postEditCategory);

router.get("/delete_category/:id",adminCategory.deleteCategory);

router.get("/view_product",productController.viewProduct);

router.get("/add_product",productController.getAddProduct);

router.post("/add_product",multerUploads.uploads,productController.posAddProduct);

router.get("/delete_product/:id",productController.getDeleteProduct);

router.get("/edit_product/:id",productController.getEditProduct)

router.post("/edit_product/:id",multerUploads.editeduploads,productController.postEditProduct);

module.exports = router;
