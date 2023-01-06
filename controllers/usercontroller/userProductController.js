const { response } = require("../../app")
const product=require("../../helpers/userHelpers/productHelpers")

let proId;

module.exports={

    //get user shop
    getUserShop:(req,res)=>{

        product.listProduct().then((response)=>{

            res.render("user/shop",{response})
        })
    },



    //get single view
    getSingleView:(req,res)=>{

        product.getSingleView(req.params.id).then((response)=>{

             proId=response[0];


           res.render("user/product-single-view",{proId})
        })

    },



    //get cart
    getUserCart:(req,res)=>{

        res.render("user/cart")
        
    },


    //add to cart
    getAddToCart:(req,res)=>{

        product.getAddToCart(req.params.id,req.session.user._id).then((response)=>{
            
        })


    }
}