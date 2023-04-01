const db=require('../../config/connection')
const collection=require('../../config/collections');
const { ObjectId } = require('mongodb-legacy');
const { response } = require('../../app');
const Razorpay = require('razorpay');
const razorpay = require('../../utils/razorpay');


var instance = new Razorpay({
    key_id: razorpay.id,
    key_secret: razorpay.secret_id,
  });
 
module.exports={

    //get shop
    getShop:(categoryId)=>{
        console.log("ooooooooooo");
        console.log(categoryId);
        if(categoryId==null){
            return new Promise(async(resolve, reject) => {
                let products=await db.get().collection(collection.PRODUCT_COLLECTION).find({list:true}).toArray()
                resolve(products)
            })
        }else{
            return new Promise(async(resolve, reject) => {
                let products=await db.get().collection(collection.PRODUCT_COLLECTION).find({$and: [{ list: true },{ category:new ObjectId(categoryId)}]}).toArray()
                // console.log(products);
                resolve(products)
            })
        }
        
    },

    getProductDetails:(productId)=>{
        return new Promise(async(resolve, reject) => {
            let product=await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new ObjectId(productId)})
            resolve(product)
        })
    },

    getAllCategory:()=>{
        return new Promise(async(resolve, reject) => {
            let categories=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(categories)
        })
    },

    getAddToCart:(productId,userId)=>{
        

        return new Promise(async(resolve, reject) => {
            
            productId=new ObjectId(productId)
            userId=new ObjectId(userId)
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:userId})
            console.log(userCart)
            if(userCart){
                console.log("in usercart");

                let productExist=await db.get().collection(collection.CART_COLLECTION).findOne({user:userId,products:{$elemMatch:{productId}}})

                if(productExist){
                    db.get().collection(collection.CART_COLLECTION).updateOne({user:userId,products:{$elemMatch:{productId}}},{$inc: { "products.$.quantity":1}}).then((response)=>{
                        resolve(response)
                    })

                }else{

                    db.get().collection(collection.CART_COLLECTION).updateOne({user:userId},{$push:{products:{productId,quantity:1}}},{upsert:true}).then((response)=>{
                        resolve(response)
                    })

                }
            }else{
                let cartObj={
                    user:userId,
                    products:[{productId,quantity:1}]
                }

                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve(response)
                })
            }
        })
    },


    getCart:(userId)=>{
        return new Promise(async(resolve, reject) => {
            let cartList=await db.get().collection(collection.CART_COLLECTION).aggregate([

                {$match:{'user':new ObjectId(userId)}},

                {$unwind:'$products'},

                {$project:{productId:'$products.productId',quantity:'$products.quantity'}},

                {$lookup:{from:'products',localField:'productId',foreignField:'_id',as:'product'}}


            ]).toArray()
            
            // console.log(cartList);
            resolve(cartList)
        })
    },



    changeQuantity:(body)=>{
        return new Promise(async(resolve, reject) => {
            console.log(body);
            if(body.count==-1 && body.quantity==1){
                await db.get().collection(collection.CART_COLLECTION).updateOne({_id:new ObjectId(body.cart)},{$pull:{products:{productId:new ObjectId(body.products)}}})

                resolve({removed:true})
            }else{
                let count=parseInt(body.count)
                let productId=new ObjectId(body.products)
        
                await db.get().collection(collection.CART_COLLECTION).updateOne({_id:new ObjectId(body.cart),'products.productId':productId},{$inc:{"products.$.quantity":count}})
                
                resolve({change:true})
            }
        })
    },

    subTotal:(userId)=>{
        return new Promise(async(resolve, reject) => {
            let subTotal=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {$match:{user:new ObjectId(userId)}},

                {$unwind:'$products'},

                {$project:{productId:'$products.productId',quantity:'$products.quantity'}},

                {$lookup:{from:'products',localField:'productId',foreignField:'_id',as:'proDetails'}},

                {$project:{quantity:1,price:{$arrayElemAt:['$proDetails.price',0]}}},

                {$project:{subTotal:{$multiply:['$quantity','$price']}}}

            ]).toArray()
            // console.log(subTotal);
            resolve(subTotal)
        })
    },

    totalAmount:(userId)=>{
        return new Promise(async(resolve, reject) => {
            let totalAmount=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {$match:{user:new ObjectId(userId)}},

                {$unwind:'$products'},

                {$project:{productId:'$products.productId',quantity:'$products.quantity'}},

                {$lookup:{from:'products',localField:'productId',foreignField:'_id',as:'proDetails'}},

                {$project:{quantity:1,proDetails:{$arrayElemAt:['$proDetails',0]}}},

                {$group:{_id:null,totalAmount:{$sum:{$multiply:['$quantity','$proDetails.price']}}}}

            ]).toArray()

            // console.log(totalAmount);
            resolve(totalAmount)
        })
    },


    removeCart:(body)=>{
        return new Promise(async(resolve, reject) => {
            await db.get().collection(collection.CART_COLLECTION).updateOne({_id:new ObjectId(body.cart)},{'$pull':{products:{productId:new ObjectId(body.product)}}})

            resolve({removed:true})
        })
    },


    postAddAddress:(address,userId)=>{

        let addressObj={
            _id:new ObjectId,
            fname:address.fname,
            lname:address.lname,
            apartment:address.apartment,
            street:address.street,
            city:address.city,
            district:address.district,
            state:address.state,
            pincode:address.pincode,
            mobile:address.mobile,
            email:address.email
        }
        return new Promise(async(resolve, reject) => {
            let addressExist=await db.get().collection(collection.ADDRESS_COLLECTION).findOne({user:new ObjectId(userId)})

            if(addressExist){
                await db.get().collection(collection.ADDRESS_COLLECTION).updateOne({user:new ObjectId(userId)},{'$push':{'address':addressObj}})

                resolve()
            }else{
                let addAddress={
                    user:new ObjectId(userId),
                    address:[addressObj]
                }

                await db.get().collection(collection.ADDRESS_COLLECTION).insertOne(addAddress)

                resolve()
            }
        })
    },

    storedAddress:(userId)=>{
        return new Promise(async(resolve, reject) => {
            let storedAddress=await db.get().collection(collection.ADDRESS_COLLECTION).findOne({user:new ObjectId(userId)})

            resolve(storedAddress)
        })
    },


    postOrders:(OrderDetails,userId,totalAmount,DiscountAmount,couponName)=>{
        return new Promise(async(resolve, reject) => {
            console.log((OrderDetails));
            // console.log(userId);

            let insertCoupon=await db.get().collection(collection.USER_COLLECTION).updateOne({'coupons.couponName':couponName},{$set:{'coupons.$.couponstatus':true}})

            let proDetails=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {$match:{user:new ObjectId(userId)}},

                {$unwind:'$products'},

                {$project:{productId:'$products.productId',quantity:'$products.quantity'}},

                {$lookup:{from:'products',localField:'productId',foreignField:'_id',as:'proDetails'}},

                {$unwind:'$proDetails'},

                {$project:{_id:'$proDetails._id',quantity:1,productName:'$proDetails.productname',price:'$proDetails.price',category:'$proDetails.category',image:'$proDetails.image'}}
            ]).toArray()
            console.log(proDetails[0]?.quantity);

            let address=await db.get().collection(collection.ADDRESS_COLLECTION).aggregate([
                {$match:{user:new ObjectId(userId)}},

                {$unwind:'$address'},

                {$project:{address:'$address'}},

                {$match:{'address._id':new ObjectId(OrderDetails.address)}},

                {$project:{address:'$address'}}
            ]).toArray()

            // console.log(address);

            //Inventory Management
            for(let i=0;i<proDetails.length;i++){
                await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(proDetails[i]._id)},{$inc:{quantity:-proDetails[i].quantity}})
            }

            let orderedAddress=address[0]?.address
            let paymentStatus=OrderDetails.paymentMethod==='COD'? 'pending':'pending'

            let orderData={
                _id:new ObjectId(),
                fname:orderedAddress.fname,
                lname:orderedAddress.lname,
                productDetails:proDetails,
                paymentMethod:OrderDetails.paymentMethod,
                paymentStatus:paymentStatus,
                totalAmount:Number(totalAmount),
                discountAmount:Number(DiscountAmount),
                shippingAddress:orderedAddress,
                orderStatus:'Ordered',
                orderedDate:new Date()

            }

            



            let order=await db.get().collection(collection.ORDER_COLLECTION).findOne({user:new ObjectId(userId)})
            console.log(order);

            if(order){
                await db.get().collection(collection.ORDER_COLLECTION).updateOne({user:new ObjectId(userId)},{'$push':{'orders':orderData}})

                resolve(response)
            }else{
                let newOrder={
                    user:new ObjectId(userId),
                    orders:[orderData]
                }

                await db.get().collection(collection.ORDER_COLLECTION).insertOne(newOrder)
            }

            await db.get().collection(collection.CART_COLLECTION).deleteMany({user:new ObjectId(userId)})

            resolve(response)
        })
    },


    getOrders:(userId)=>{
        return new Promise(async(resolve, reject) => {
            let Orders=await db.get().collection(collection.ORDER_COLLECTION).aggregate([

                {$match:{user:new ObjectId(userId)}},

                {$unwind:'$orders'},

                {$sort:{'orders.orderedDate':-1}}
            ]).toArray()

            // console.log(Orders);
            resolve(Orders)
        })
    },


    getOrderDetails:(OrderId)=>{
        
        return new Promise(async(resolve, reject) => {
            let orderDetails=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {$match:{'orders._id':new ObjectId(OrderId)}},

                {$unwind:"$orders"},

                {$match:{'orders._id':new ObjectId(OrderId)}}
            ]).toArray()

            let details=orderDetails[0].orders
            
             let productDetails=details.productDetails
            //  console.log(productDetails);
             let address=details.shippingAddress
             resolve({address,productDetails,orderDetails})
            
        })
    },

    cancelOrder:(OrderId)=>{
        console.log(OrderId);
        return new Promise(async(resolve, reject) => {
            // let orders=await db.get().collection(collection.ORDER_COLLECTION).find({'orders._id':new ObjectId(OrderId)}).toArray()
            // console.log(orders);
            // const index = orders[0].orders.findIndex(orders => orders._id.toString()==OrderId.toString());
            
            // await db.get().collection(collection.ORDER_COLLECTION).updateOne({'orders._id':new ObjectId(OrderId)},{$set:{['orders.'+index+'.orderStatus']:'Cancelled'}}).then((response)=>{

            //     resolve(response)
            // })
            db.get().collection(collection.ORDER_COLLECTION).updateOne({'orders._id':new ObjectId(OrderId)},{$set:{'orders.$.orderStatus':'Cancelled'}}).then(async(response)=>{
                


                let CancelledItems=await db.get().collection(collection.ORDER_COLLECTION).aggregate([

                    {$unwind:'$orders'},

                    {$match:{'orders._id':new ObjectId(OrderId)}},

                    {$match:{'orders.orderStatus':'Cancelled'}},

                    {$unwind:'$orders.productDetails'},

                    {$project:{_id:0,productDetails:'$orders.productDetails'}}
                ]).toArray()
                console.log('>>>>>>>>>>>>>>>>');
                console.log(CancelledItems);

                for(let i=0;i<CancelledItems.length;i++){
                    await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(CancelledItems[i].productDetails._id)},{$inc:{quantity:CancelledItems[i].productDetails.quantity}})
                }
                resolve(response)
            })

        })
    },

    returnOrder:(OrderId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).updateOne({'orders._id':new ObjectId(OrderId)},{$set:{'orders.$.orderStatus':'Returned'}}).then(async(response)=>{
                
                let ReturnedItems=await db.get().collection(collection.ORDER_COLLECTION).aggregate([

                    {$unwind:'$orders'},

                    {$match:{'orders._id':new ObjectId(OrderId)}},

                    {$match:{'orders.orderStatus':'Returned'}},

                    {$unwind:'$orders.productDetails'},

                    {$project:{_id:0,productDetails:'$orders.productDetails'}}
                ]).toArray()
                

                for(let i=0;i<ReturnedItems.length;i++){
                    await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(ReturnedItems[i].productDetails._id)},{$inc:{quantity:ReturnedItems[i].productDetails.quantity}})
                }

                resolve(response)
            })
        })
    },

    getCartCount:(userId)=>{
        return new Promise(async(resolve, reject) => {
            
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userId)})
            let cartCount=0
            if(cart){

                cartCount=cart.products.length
                resolve(cartCount)
            }else{
                resolve(cartCount)
            }

        })
    },

    getWishCount:(userId)=>{
        return new Promise(async(resolve, reject) => {
            
            let wishlist=await db.get().collection(collection.WISHLIST_COLLECTION).findOne({user:new ObjectId(userId)})
            let wishCount=0
            if(wishlist){

                wishCount=wishlist.wishItems.length
                resolve(wishCount)
            }else{
                resolve(wishCount)
            }

        })
    },

    addWishList:(proId,userId)=>{
        console.log(userId);
        let proObj={
            productId:new ObjectId(proId)
        }
        return new Promise(async(resolve, reject) => {
            let wishlist=await db.get().collection(collection.WISHLIST_COLLECTION).findOne({user:new ObjectId(userId)})

            if(wishlist){
                let Index=wishlist.wishItems.findIndex((item)=>item.productId==new ObjectId(proId))

                if(Index==-1){
                    db.get().collection(collection.WISHLIST_COLLECTION).updateOne({user:new ObjectId(userId)},
                    {$addToSet:{wishItems:proObj}}).then(()=>{
                        resolve({status:true})
                    })
                }
            }else{
                const wishObj={
                    user:new ObjectId(userId),
                    wishItems:[proObj]
                }
                db.get().collection(collection.WISHLIST_COLLECTION).insertOne(wishObj).then(()=>{
                    resolve({status:true})
                })
            }
        })
    },

    getWishlist:(userId)=>{
        return new Promise(async(resolve, reject) => {
            let wishlist=await db.get().collection(collection.WISHLIST_COLLECTION).aggregate([

                {$match:{user:new ObjectId(userId)}},

                {$unwind:'$wishItems'},

                {$project:{productId:'$wishItems.productId'}},

                {$lookup:{from:'products',localField:'productId',foreignField:'_id',as:'proDetails'}},

                {$project:{productId:1,wishlist:{$arrayElemAt:['$proDetails',0]}}}
            ]).toArray()
            resolve(wishlist)
        })

    },

    removeWishlist:(body,userId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.WISHLIST_COLLECTION).updateOne({user:new ObjectId(userId)},{'$pull':{wishItems:{productId:new ObjectId(body.productId)}}}).then(()=>{
                resolve({removeProduct:true})
            })
        })
    },

    generateRazorpay:(userId,totalAmount)=>{
        return new Promise(async(resolve, reject) => {
            let orders=await db.get().collection(collection.ORDER_COLLECTION).find({user:new ObjectId(userId)}).toArray()

            let order=orders[0]?.orders.slice().reverse();

            let orderId=order[0]?._id
            totalAmount=totalAmount*100

            var options = {
                amount: Number(totalAmount),
                currency: "INR",
                receipt: "" + orderId,
              };
              instance.orders.create(options, function (err, order) {
                if (err) {
        
                } else {
        
                  resolve(order);
        
                }
              });
        })
    },


    verifyPayment:(details)=>{
        console.log(details);
        return new Promise((resolve, reject) => {
            try {

                const crypto = require("crypto");
                let hmac = crypto.createHmac("sha256", razorpay.secret_id);
                hmac.update(
                  details["payment[razorpay_order_id]"] +
                  "|" +
                  details["payment[razorpay_payment_id]"]
                );
                hmac = hmac.digest("hex");
                if (hmac == details["payment[razorpay_signature]"]) {
                  resolve();
                } else {
                  reject("not match");
                }
            } catch (err) {
        
            }
        })
    },

    changePaymentStatus:(userId,orderId)=>{
        return new Promise(async(resolve, reject) => {
            await db.get().collection(collection.ORDER_COLLECTION).updateOne({'orders._id':new ObjectId(orderId)},{$set:{'orders.$.orderStatus':'Success','orders.$.paymentStatus':'Paid'}})

            await db.get().collection(collection.CART_COLLECTION).deleteMany({_id:new ObjectId(userId)})

            resolve()
        })
    },


    validateCoupon:(couponCode,totalAmount,userId)=>{
        return new Promise(async(resolve, reject) => {
            try {
                
                let discountAmount=0;
                let couponTotal=totalAmount;
                let coupon=await db.get().collection(collection.COUPON_COLLECTION).findOne({couponName:couponCode})
                if(coupon){
                    if(totalAmount>=coupon.minPurchase){
                        discountAmount=(totalAmount*coupon.discountPercentage)/100
                        if(discountAmount>coupon.maxDiscountValue){
                            discountAmount=coupon.maxDiscountValue
                        }
                        
                        couponTotal=totalAmount-discountAmount
                    }
                }else{
                    resolve({status:false,err:"coupon does'nt exist"})
                }


                let couponExist=await db.get().collection(collection.COUPON_COLLECTION).findOne({couponName:couponCode})
                if(couponExist){
                    if(new Date(couponExist.expiry)-new Date() >0){
                        let userCoupenExist=await db.get().collection(collection.USER_COLLECTION).findOne({_id:new ObjectId(userId),'coupons.couponName':couponCode})
                        if(!userCoupenExist){
                            resolve({discountAmount,couponTotal,totalAmount,success:' Coupon  Applied  SuccessFully'})
                        }else{
                            resolve({status:true,err:'This coupon is Already Used'})
                        }
                    }else{
                        resolve({status:false,err:'Coupon Expired'})
                    }
                }else{
                    resolve({status: false, err: "coupon does'nt exist"})
                }
            } catch (error) {
                
            }
        })
    },


    addCouponIntoUserDb:(couponData,userId)=>{
        return new Promise((resolve, reject) => {
            let couponObj = {
                couponstatus: false,
                couponName: couponData.couponName,
            }
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:new ObjectId(userId)},{$addToSet:{coupons:couponObj}}).then((response)=>{
                resolve(response)
            })
        })

    },

    couponStatus:(couponName)=>{
        return new Promise(async(resolve, reject) => {
            // await db.get().collection(collection.USER_COLLECTION).find({'coupons.couponName':couponName},{'coupons.$':1}).toArray().then((couponStatus)=>{
            //     resolve(couponStatus)
            // })

            db.get().collection(collection.USER_COLLECTION).aggregate([
                { $match: { "coupons.couponName": couponName } },
                { $project: {
                  name: 1,
                  email: 1,
                  phone: 1,
                  password: 1,
                  blocked: 1,
                  coupons: {
                    $filter: {
                      input: "$coupons",
                      as: "coupon",
                      cond: { $eq: ["$$coupon.couponName", couponName] }
                    }
                  }
                } },
                { $project: { "coupons": { $arrayElemAt: ["$coupons", 0] } } }
              ]).toArray().then((couponStatus)=>{
                resolve(couponStatus)
              })
        })

    }


    
} 