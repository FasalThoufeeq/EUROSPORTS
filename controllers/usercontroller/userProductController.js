const { response, render } = require("../../app");
const { storedAdress } = require("../../helpers/userHelpers/productHelpers");
const product=require("../../helpers/userHelpers/productHelpers");
const productController = require("../admincontroller/productController");

let proId,cartCount;

module.exports={

    //get user shop
    getUserShop:async(req,res)=>{

         cartCount=null
        if(req.session.user){
            
            cartCount= await product.getCartCount(req.session.user._id)
            product.listProduct().then((response)=>{

            res.render("user/shop",{response,cartCount})
            })
        }else{

            product.listProduct().then((response)=>{

                res.render("user/shop",{response})
            })
        }
       
        
        
    },



    //get single view
    getSingleView:async(req,res)=>{

        if(req.session.user){

            cartCount= await product.getCartCount(req.session.user._id)
            product.getSingleView(req.params.id).then((response)=>{

                proId=response[0];
   
   
              res.render("user/product-single-view",{proId,cartCount})
           })



        }

        product.getSingleView(req.params.id).then((response)=>{

             proId=response[0];


           res.render("user/product-single-view",{proId})
        })

    },



    //get cart
    getUserCart:async(req,res)=>{

        let user=req.session.user
        //console.log(user);
        let totalAmount=await product.getTotalAmount(req.session.user._id)
        let subTotal=await product.getSubTotal(req.session.user._id)
        
        cartCount= await product.getCartCount(req.session.user._id)
        product.viewCart(req.session.user._id).then((cartList)=>{
            console.log(cartList.products);
            // console.log(subTotal);
            res.render("user/cart",{cartList,cartCount,user,totalAmount,subTotal})
        })

        
    },


    //add to cart
    getAddToCart:(req,res)=>{
        // console.log(req.session.user);
        // console.log(req.params.id);
        product.getAddToCart(req.params.id,req.session.user._id).then((response)=>{

            //res.redirect("/shop")
            res.json({update:true})
            
        })


    },


    //checkout
    getCheckoutPage:async(req,res)=>{

        totalAmount=await product.getTotalAmount(req.session.user._id)
        subTotal=await product.getSubTotal(req.session.user._id,)
        cartCount= await product.getCartCount(req.session.user._id)
        let storedAddress=await product.storedAdress(req.session.user._id)
        let user=req.session.user

        console.log(storedAddress+'address');
        product.viewCart(req.session.user._id).then((cartList)=>{


            
            console.log('start'); 
            console.log(cartList);
            console.log('stop');

          res.render("user/checkout",{totalAmount,subTotal,cartCount,cartList,storedAddress,user})
        })
        
    },




    //address
    getAddAdress:(req,res)=>{

        res.render("user/address")

    },



    //change quantiry
    changeQauntity:async(req,res)=>{

        await product.changeQauntity(req.body).then(async(response)=>{
            // console.log('reacherd change quantity');
            response.totalAmount= await product.getTotalAmount(req.body.user)



            res.json(response)

        })


    },


    //remove cart

    removeCart:(req,res)=>{

        console.log('this is remove cart');

        product.removeCart(req.body).then((response)=>{
            console.log(response);
            console.log('in fn');
            res.json(response)

        })

        

    },

    //success message

    paySuccess:(req,res)=>{
      
        res.render("user/success")
    },



    //get order details

    getOrders:(req,res)=>{

        res.render("user/orders")
    },


    // post order details
    postOrders:async(req,res)=>{

        console.log(req.body);
        console.log(req.session.user._id);  

        let total=await product.getTotalAmount(req.session.user._id)

        console.log(total+"00000");


        product.postOrders(req.body,total).then((response)=>{
            console.log(req.body.paymentMethod);


            if(req.body.paymentMethod=='COD'){

                res.json({COD:true})
            }


        })

        // res.render("user/success")

    },



    //order details

    getOrderDetails:(req,res)=>{
        res.render("user/order-details")
    }



} 