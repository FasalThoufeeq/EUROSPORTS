const productHelper=require('../../Helpers/userHelpers/userProduct')


let cartCount,wishCount,username
let discountAmount,couponTotal,couponCode,couponName
module.exports={
    //get shop
    getShop:async(req,res)=>{
        if(req.session.user){
            cartCount=await productHelper.getCartCount(req.session.user._id)
            wishCount=await productHelper.getWishCount(req.session.user._id)
            username=req.session.user.name
            productHelper.getShop().then(async(products)=>{
            
                let categories=await productHelper.getAllCategory()
                res.render('user/shop',{products,cartCount,categories,username,wishCount,loggedInStatus:true})
            })
        }else{
            productHelper.getShop().then(async(products)=>{
            
                let categories=await productHelper.getAllCategory()
                // console.log(categories);
                res.render('user/shop',{products,categories})
            })
        }
       
        
    },

    getProductDetails:async(req,res)=>{
        // console.log(req.params.id);
        if(req.session.user){
            username=req.session.user.name
            cartCount=await productHelper.getCartCount(req.session.user._id)
            wishCount=await productHelper.getWishCount(req.session.user._id)
            productHelper.getProductDetails(req.params.id).then((product)=>{

                res.render('user/product-details',{product,cartCount,wishCount,username,loggedInStatus:true})
            })
        }else{
            productHelper.getProductDetails(req.params.id).then((product)=>{

                res.render('user/product-details',{product})
            })
        }
        
    },

    categoryShow:async(req,res)=>{
        
        if(req.session.user){
            username=req.session.user.name
            cartCount=await productHelper.getCartCount(req.session.user._id)
            wishCount=await productHelper.getWishCount(req.session.user._id)
            productHelper.getShop(req.params.id).then(async(products)=>{
                let categories=await productHelper.getAllCategory()
                res.render('user/shop',{products,cartCount,wishCount,categories,loggedInStatus:true,username})
            })
        }else{
            productHelper.getShop(req.params.id).then(async(products)=>{
                let categories=await productHelper.getAllCategory()
                res.render('user/shop',{products,categories})
            })
        }
       
    },


    getCart:async(req,res)=>{
        
        username=req.session.user.name
        let user=req.session.user
        let subTotal=await productHelper.subTotal(req.session.user._id)
        let totalAmount=await productHelper.totalAmount(req.session.user._id)
        cartCount=await productHelper.getCartCount(req.session.user._id)
        wishCount=await productHelper.getWishCount(req.session.user._id)
        
        productHelper.getCart(req.session.user._id).then((cartList)=>{
            
            res.render('user/cart',{totalAmount,cartCount,wishCount,subTotal,user,cartList,username,loggedInStatus:true})
        })
    },

    getAddToCart:(req,res)=>{
        // console.log(req.params.id);
        // console.log(req.session.user._id);
        productHelper.getAddToCart(req.params.id,req.session.user._id).then(()=>{
            res.json({update:true})
        })
    },

    changeQuantity:(req,res)=>{
        productHelper.changeQuantity(req.body).then(async(response)=>{
            response.totalAmount=await productHelper.totalAmount(req.session.user._id)
            res.json(response)
        })
    },

    removeCart:(req,res)=>{
        productHelper.removeCart(req.body).then((response)=>{
            res.json(response)
        })
    },


    getcheckout:async(req,res)=>{
        
        let storedAddress=await productHelper.storedAddress(req.session.user._id)
        let totalAmount=await productHelper.totalAmount(req.session.user._id)
        let cartList= await productHelper.getCart(req.session.user._id)
        let subTotal=await productHelper.subTotal(req.session.user._id)
        cartCount=await productHelper.getCartCount(req.session.user._id)
        let DiscountAmount
        let couponStatus=await productHelper.couponStatus(couponName)
        let status=couponStatus[0]?.coupons?.couponstatus
        
        if(couponName&& status==false){
            totalAmount=await productHelper.totalAmount(req.session.user._id)
            totalAmount=totalAmount[0]?.totalAmount
            DiscountAmount=discountAmount
        }else{
            
            DiscountAmount=0
            couponTotal=totalAmount[0]?.totalAmount
            totalAmount=totalAmount[0]?.totalAmount
        }
        
        res.render('user/checkout',{storedAddress,cartCount,totalAmount,cartList,subTotal,loggedInStatus:true,username,DiscountAmount,couponTotal})
    },

    addAddress:(req,res)=>{
        productHelper.postAddAddress(req.body,req.session.user._id).then(()=>{
            res.redirect('/checkout')
        })
    },

    postOrder:async(req,res)=>{
        let totalAmount=await productHelper.totalAmount(req.session.user._id)
        totalAmount=totalAmount[0]?.totalAmount 
        let DiscountAmount=0
        if(couponCode){
            totalAmount=couponTotal
            DiscountAmount=discountAmount
        }
        productHelper.postOrders(req.body,req.session.user._id,totalAmount,DiscountAmount,couponName).then(async(response)=>{
            console.log(req.body.paymentMethod);
            if(req.body.paymentMethod=='COD'){
                
                res.json({COD:true})
            }else{
                productHelper.generateRazorpay(req.session.user._id,totalAmount).then((order)=>{
                    res.json(order)
                })
            }
            
        })
        
    },

    verifyPayment:(req,res)=>{
        productHelper.verifyPayment(req.body).then(()=>{
            productHelper.changePaymentStatus(req.session.user._id,req.body["order[receipt]"]).then(()=>{
                res.json({status:true})
            })
        }).catch((err)=>{
                res.json({status:'payment failed'})
        })
    },


    orderSuccess:async(req,res)=>{
        cartCount=await productHelper.getCartCount(req.session.user._id)
        wishCount=await productHelper.getWishCount(req.session.user._id)
        res.render('user/success',{cartCount,wishCount,loggedInStatus:true,username})
    },

    getOrders:async(req,res)=>{
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
        cartCount=await productHelper.getCartCount(req.session.user._id)
        wishCount=await productHelper.getWishCount(req.session.user._id)
        productHelper.getOrders(req.session.user._id).then((orders)=>{
            username=req.session.user.name
            res.render('user/orders',{orders,cartCount,wishCount,getDate,loggedInStatus:true,username})
        })
    },

    getOrderDetails:async(req,res)=>{
        let OrderId=req.query.order
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
        cartCount=await productHelper.getCartCount(req.session.user._id)
        wishCount=await productHelper.getWishCount(req.session.user._id)
        productHelper.getOrderDetails(OrderId).then((response)=>{
            let products=response.productDetails
            let address=response.address
            let orderDetails=response.orderDetails
            let multipliedTotal=[]
            for(let i=0;i<products.length;i++){
                multipliedTotal.push(products[i].quantity*products[i].price) 
            }
            
            res.render('user/orderDetails',{products,cartCount,wishCount,address,orderDetails,multipliedTotal,getDate,loggedInStatus:true,username})
        })
    },

    cancelOrder:(req,res)=>{

        productHelper.cancelOrder(req.params.id).then((response)=>{
            
            res.json(response)
        })
        
    },

    returnOrder:(req,res)=>{
        productHelper.returnOrder(req.params.id).then((response)=>{
            res.json(response)
        })
    },

    addWishList:(req,res)=>{
        productHelper.addWishList(req.params.id,req.session.user._id).then((response)=>{
            res.json(response)
        })
    },

    getWishlist:async(req,res)=>{
        username=req.session.user.name
        cartCount=await productHelper.getCartCount(req.session.user._id)
        wishCount=await productHelper.getWishCount(req.session.user._id)
        productHelper.getWishlist(req.session.user._id).then((wishlist)=>{
            res.render('user/wishlist',{wishlist,cartCount,wishCount,loggedInStatus:true,username})
        })
    },

    removeWishlist:(req,res)=>{
        productHelper.removeWishlist(req.body,req.session.user._id).then((response)=>{
            res.json(response)
        })
    },


    validateCoupon:async(req,res)=>{
        try{
            couponCode=req.query.couponName
            let totalAmount=await productHelper.totalAmount(req.session.user._id)
            totalAmount=totalAmount[0].totalAmount
            productHelper.validateCoupon(couponCode,totalAmount,req.session.user._id).then((response)=>{
                discountAmount=response.discountAmount
                couponTotal=response.couponTotal

                console.log(response);
                res.json(response)
            })

        }catch(err){
            res.status(500).send(err)
        }
    },

    postCart:async(req,res)=>{
        console.log('pppppppp');
        
        let couponData=req.body
        console.log(couponData);
        couponName=req.body.couponName
        couponTotal=req.body.total
        discountAmount=req.body.discountAmount

        if(couponData.couponName){
            await productHelper.addCouponIntoUserDb(couponData, req.session.user._id).then(()=>{
                res.redirect('/checkout')
            })
        }else{
            res.redirect('/checkout')
        }
    }


}