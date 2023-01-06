const { response } = require("../../app");
const product=require("../../helpers/adminHelpers/productHelpers");
const { category } = require("../../models/connection");





module.exports={
    // view product
    viewProduct:(req,res)=>{

        let adminStatus=req.session.adminloggedIn

        let admin=req.session.admin
        product.viewProduct().then((data)=>{

            res.render("admin/view-product",{layout:"adminLayout",data,admin,adminStatus});
        })
    },


    // get add product
    getAddProduct:(req,res)=>{

        let admin=req.session.admin

        adminStatus=req.session.adminloggedIn

        product.getAddProduct().then((data)=>{

            res.render("admin/add-product",{layout:"adminLayout",data,admin,adminStatus})
        })

        
    },

    //post add product
    posAddProduct:(req,res)=>{
        // console.log(req.body.file);

        product.postAddProduct(req.body,req.file.filename).then((data)=>{


            res.redirect("/admin/view_product")
        })


    },


    // get delete product

    getDeleteProduct:(req,res)=>{
        product.deleteProduct(req.params.id).then((response)=>{
            res.redirect("/admin/view_product")
        })
    },



   // get edit product

   getEditProduct:(req,res)=>{


    product.viewCategory().then((response)=>{

        let admin=req.session.admin

        var categoryres=response;

        product.getEditProduct(req.params.id).then((editedData)=>{

            var editproduct=editedData

                 adminStatus=req.session.adminloggedIn

                res.render("admin/edit-viewproduct",{layout:"adminLayout",categoryres,editproduct,admin,adminStatus})
            })

    })

    


   },




    // post edit product
    postEditProduct:(req,res)=>{

        console.log(req.body);
        product.postEditProduct(req.params.id,req.body,req.body.fileEdit).then((response)=>{

            res.redirect("/admin/view_product")

        })        



    }

    




}