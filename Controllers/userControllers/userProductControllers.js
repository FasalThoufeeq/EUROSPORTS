const productHelper=require('../../Helpers/userHelpers/userProduct')



module.exports={
    //get shop
    getShop:(req,res)=>{
        if(req.session.user){
            let username=req.session.user.name
            productHelper.getShop().then(async(products)=>{
            
                let categories=await productHelper.getAllCategory()
                res.render('user/shop',{products,categories,username,loggedInStatus:true})
            })
        }else{
            productHelper.getShop().then(async(products)=>{
            
                let categories=await productHelper.getAllCategory()
                // console.log(categories);
                res.render('user/shop',{products,categories})
            })
        }
       
        
    },

    getProductDetails:(req,res)=>{
        // console.log(req.params.id);
        if(req.session.user){
            let username=req.session.user.name
            productHelper.getProductDetails(req.params.id).then((product)=>{

                res.render('user/product-details',{product,username,loggedInStatus:true})
            })
        }else{
            productHelper.getProductDetails(req.params.id).then((product)=>{

                res.render('user/product-details',{product})
            })
        }
        
    },

    categoryShow:(req,res)=>{
        console.log("...............");
        console.log(req.params.id);
        if(req.session.user){
            let username=req.session.user.name
            productHelper.getShop(req.params.id).then(async(products)=>{
                let categories=await productHelper.getAllCategory()
                res.render('user/shop',{products,categories,loggedInStatus:true,username})
            })
        }else{
            productHelper.getShop(req.params.id).then(async(products)=>{
                let categories=await productHelper.getAllCategory()
                res.render('user/shop',{products,categories})
            })
        }
       
    },


    getCart:async(req,res)=>{
        let username=req.session.user.name
        let user=req.session.user
        let subTotal=await productHelper.subTotal(req.session.user._id)
        let totalAmount=await productHelper.totalAmount(req.session.user._id)
        
        productHelper.getCart(req.session.user._id).then((cartList)=>{
            
            res.render('user/cart',{totalAmount,subTotal,user,cartList,username,loggedInStatus:true})
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
        // console.log(storedAddress);
        console.log(cartList);
        res.render('user/checkout',{storedAddress,totalAmount,cartList,subTotal})
    },

    addAddress:(req,res)=>{
        productHelper.postAddAddress(req.body,req.session.user._id).then(()=>{
            res.redirect('/checkout')
        })
    },

    postOrder:async(req,res)=>{
        // console.log(req.body);
        let totalAmount=await productHelper.totalAmount(req.session.user._id)
        productHelper.postOrders(req.body,req.session.user._id,totalAmount[0].totalAmount)
        res.render('user/success')
    },

    getOrders:(req,res)=>{
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
        productHelper.getOrders(req.session.user._id).then((orders)=>{
            // console.log(orders);
            res.render('user/orders',{orders,getDate})
        })
    },

    getOrderDetails:(req,res)=>{
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

        productHelper.getOrderDetails(OrderId).then((response)=>{
            let products=response.productDetails
            let address=response.address
            let orderDetails=response.orderDetails
            let multipliedTotal=[]
            for(let i=0;i<products.length;i++){
                multipliedTotal.push(products[i].quantity*products[i].price) 
            }
            // console.log('.................');
            // console.log(orderDetails);
            res.render('user/orderDetails',{products,address,orderDetails,multipliedTotal,getDate})
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
    }


}