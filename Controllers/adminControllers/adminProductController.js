const cloudinary=require('../../utils/clodinary')
const productHelper=require('../../Helpers/adminHelpers/adminProductHelper')
const path=require('path')
const { response } = require('../../app')
const { totalAmount } = require('../../Helpers/userHelpers/userProduct')




module.exports={

    //view product
    viewProduct:(req,res)=>{
        productHelper.getViewProduct().then((products)=>{

            res.render('admin/view-product',{layout:'admin-layout',products})
        })
    },

    //get add product
    addproduct:(req,res)=>{
        productHelper.getAddProduct().then((categorys)=>{

            res.render('admin/add-product',{layout:'admin-layout',categorys})
        })
    },

    postAddProduct:(req,res)=>{
        try{
            productHelper.addProducts(req.body).then(async(product_id)=>{
                let imgUrls=[]
                // console.log(req.files)
                // console.log(req.file)
                for(let i=0;i<req.files.length;i++){
                    
                    let result= await cloudinary.uploader.upload(req.files[i].path)
                    // console.log(result)
                    imgUrls.push(result.url)
                }
                // console.log(imgUrls);
                if(imgUrls.length!==0){

                    productHelper.addProductImage(product_id,imgUrls)
                }
                
            })
        }catch{
            console.log(err);
        }finally{
            res.redirect('/admin/add-products')
        }
    },

    getAddCategory:(req,res)=>{
        productHelper.getAddCategory().then((category)=>{
            res.render('admin/add-category',{layout:'admin-layout',category})
        })
    },

    postCategory:(req,res)=>{
        productHelper.postAddCategory(req.body).then(()=>{
            res.redirect('/admin/add-category')
        })
    },

    getEditCategory:(req,res)=>{
        productHelper.editCatergory(req.params.id).then((category)=>{
            res.render('admin/edit-category',{layout:'admin-layout',category})
        })
    },

    postEditcategory:(req,res)=>{
      
        // console.log(req.body.editcategoryname);
        productHelper.postEditCategory(req.body.editcategoryname,req.params.id).then(()=>{
            res.redirect('/admin/add-category')
        })
    },

    deleteCategory:(req,res)=>{
        productHelper.deleteCategory(req.params.id).then(()=>{
            res.redirect('/admin/add-category')
        })

    },

    getEditProduct:(req,res)=>{
        productHelper.getAddCategory().then((categorys)=>{
            productHelper.getEditProduct(req.params.id).then((product)=>{
                // console.log(product);
                res.render('admin/edit-product',{layout:'admin-layout',product,categorys})
            })
        })
        
    },

    //post edited product
    postEditProduct:(req,res)=>{
        try{
            productHelper.postEditProduct(req.params.id,req.body).then(async()=>{
                
                let imgUrls=[]
                for(let i=0;i<req.files.length;i++){
                    
                    let result= await cloudinary.uploader.upload(req.files[i].path)
    
                    // console.log(result)
                    imgUrls.push(result.url)
                }
                if(imgUrls.length!==0){
                    
                    productHelper.addProductImage(req.params.id,imgUrls)
                }
                
            })
        }catch{
            console.log(err);
        }finally{
            res.redirect('/admin/view-products')
        }
    },

    //list
    listProduct:(req,res)=>{
        productHelper.listProduct(req.params.id)
            res.redirect('/admin/view-products')
    },

    //unlist
    unlistProduct:(req,res)=>{
        productHelper.unlistProduct(req.params.id)
            res.redirect('/admin/view-products')
    },

    //list orders
    getOrdersList:(req,res)=>{
        const getDate = (date) => {
            let orderDate = new Date(date);
            let day = orderDate.getDate();
            let month = orderDate.getMonth() + 1;
            let year = orderDate.getFullYear();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            return `${isNaN(day) ? "00" : day}-${isNaN(month) ? "00" : month}-${isNaN(year) ? "0000" : year
            } ${date.getHours(hours)}:${date.getMinutes(minutes)}:${date.getSeconds(
                seconds
            )}`;
        };
        productHelper.getOrdersList().then((orders)=>{
            

            res.render('admin/order-listing',{layout:'admin-layout',orders,getDate})
        })
    },

    getOrderDetails:(req,res)=>{
        const getDate = (date) => {
            let orderDate = new Date(date);
            let day = orderDate.getDate();
            let month = orderDate.getMonth() + 1;
            let year = orderDate.getFullYear();
            let hours = date.getHours();
            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            return `${isNaN(day) ? "00" : day}-${isNaN(month) ? "00" : month}-${isNaN(year) ? "0000" : year
            } ${date.getHours(hours)}:${date.getMinutes(minutes)}:${date.getSeconds(
                seconds
            )}`;
        };
        productHelper.getOrderDetails(req.params.id).then((order)=>{
            let product=order[0].orders.productDetails
            let total=order[0].orders.totalAmount
            console.log(product);
            res.render('admin/order-details',{layout:'admin-layout',order,getDate,total,product})
        })
    },

    postOrderDetails:(req,res)=>{
        console.log(req.params.id);
        productHelper.postOrderDetails(req.body,req.params.id).then(()=>{
            res.redirect('/admin//orders-list')
        })
    }
}