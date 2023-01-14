const { ObjectId } = require("mongodb")
const { AssessmentsContext } = require("twilio/lib/rest/flexApi/v1/assessments")
const { response } = require("../../app")
const { address, product } = require("../../models/connection")
// const { cart } = require("../../models/connection")
const schema=require("../../models/connection")



module.exports={

    //list product
    listProduct:()=>{
        return new Promise(async(resolve, reject) => {
            await schema.product.find().exec().then((response)=>{


                resolve(response)
            })
        })
    },



    //get single view
    getSingleView:(proId)=>{

        return new Promise(async(resolve, reject) => {
            
           await schema.product.find({_id:proId}).then((response)=>{

            

                resolve(response)
            })
        })

    },






    //get add porduct
    getAddToCart:(proId,userId)=>{
        // console.log(userId);
        productObject={
            productId:proId,
            quantity:1,
            
        }


        return new Promise(async(resolve, reject) => {
            let existCart=await schema.cart.findOne({user:userId})

            // console.log(existCart);

            if(existCart){

                let productExist= existCart.cartItems.findIndex(cartItems=>cartItems.productId==proId)

                if(productExist!=-1){

                     schema.cart.updateOne({"user":userId, "cartItems.productId":proId}, {$inc:{"cartItems.$.quantity":1}}).then((response)=>{

                        resolve({response,Update:false})
                     })
                
                }else{

                    
                    
                    schema.cart.updateOne({"user":userId},{$push:{"cartItems":productObject}}).then((response)=>{

                    resolve({response,Update:true})
                    })

                }

                // if(productExist!=-1){
                //     schema.cart.updateOne({"user":userId, "cartItems":proId},{$inc:{"cartItems.$.quantity":1}}).then((response)=>{
                //         // console.log(response);
                //         resolve({response,Update:false})
                    
                //     })

                    

                // }else{

                    
                    // console.log(response);

                // await schema.cart.updateOne()
                // }
            }else{

                let cartUpdate=new schema.cart({
                    user:userId,
                    cartItems:productObject

                })

                cartUpdate.save().then(()=>{

                    resolve({Update:true})
                })
            }

            
        })
    

    },



    viewCart:(userId)=>{
        return new Promise(async(resolve, reject) => {
            
            let cartList= await schema.cart.aggregate([
                {$match:{"user":ObjectId(userId)}},

                {$unwind: "$cartItems"},

                {$project:{products:"$cartItems.productId",quantity:"$cartItems.quantity"}},

                {$lookup:{from:"products",localField:"products",foreignField:"_id",as:"merged"}}


            ]).then((cartList)=>{


                console.log(cartList);

                resolve(cartList)

            })


            
        })

    },



    //get cart count

    getCartCount:(userId)=>{

        return new Promise(async(resolve, reject) => {
            
            let cartCount=0

            cart= await schema.cart.findOne({user:userId})

            if(cart){
                cartCount=cart.cartItems.length

            }

            resolve(cartCount)
        })


    },




    //change quantity
    changeQauntity:(details)=>{
        // console.log(details);

        // details.quantity=parseInt(details.quantity)
        // console.log(details.quantity);
        // details.count=parseInt(details.count)

        return new Promise((resolve, reject) => {
            if(details.count==-1 && details.quantity==1){

                schema.cart.updateOne({"_id":details.cart},{"$pull":{cartItems:{productId:details.products}}}).then((response)=>{
                    resolve({removed:true})
                })
            }else{
                  schema.cart.updateOne({"_id":details.cart, "cartItems.productId":details.products}, {$inc:{"cartItems.$.quantity":details.count}}).then((response)=>{

                 resolve({response,Update:false,change:true})
                })
            }
          
            
        })

    },



    //remove cart

    removeCart:(details)=>{
        console.log(details);
        return new Promise(async(resolve, reject) => {

            await schema.cart.updateOne({"_id":details.cart},
            {"$pull":{cartItems:{productId:details.product}}}).then((response)=>{
                console.log(response);
                resolve({removed:true})
            })
            
            
        })
    },


    getTotalAmount:(userId)=>{
        return new Promise(async(resolve, reject) => {
            
            let totalAmount= await schema.cart.aggregate([
                {$match:{"user":ObjectId(userId)}},

                {$unwind: "$cartItems"},

                {$project:{products:"$cartItems.productId",quantity:"$cartItems.quantity"}},

                {$lookup:{from:"products",localField:"products",foreignField:"_id",as:"merged"}},

                {$project:{products:1, quantity:1,merged:{$arrayElemAt:["$merged",0]}}},

                {$group:{_id:null, totalAmount:{$sum:{$multiply:["$quantity", "$merged.price"]}}}},


            
            ]).then((totalAmount)=>{

                console.log(totalAmount)
                resolve(totalAmount[0].totalAmount)
                // console.log(totalAmount[0].totalAmount);
            })
        })
    },



    // sub total

    getSubTotal:(userId)=>{
        return new Promise(async(resolve, reject) => {

            let subTotal= await schema.cart.aggregate([
                {$match:{"user":ObjectId(userId)}},
 
                {$unwind: "$cartItems"},

                {$project:{products:"$cartItems.productId",quantity:"$cartItems.quantity"}},

                {$lookup:{from:"products",localField:"products",foreignField:"_id",as:"merged"}},
                
                // {$match:{"products":}}

                {$project:{products:1, quantity:1, price:{$arrayElemAt:["$merged.price",0]}}},

                {$project:{subTotal:{$multiply:["$quantity","$price"]}}}


            
            ]).then((subTotal)=>{ 

                resolve(subTotal)
                console.log('this is subtotal');
                console.log(subTotal)
            })
            
        })
    },


    storedAdress:(userId)=>{

        return new Promise(async(resolve, reject) => {
            
            await schema.address.find({user:userId}).exec().then((address)=>{

                

                resolve(address)
            })
        })

    },


    //post orders
    postOrders:(orderDetails,totalAmount)=>{
        // console.log(".........");
        // console.log(order);
        // console.log(total);
        // console.log("........."); 
        return new Promise(async(resolve, reject) => {

            let productDetails=await schema.cart.aggregate([
                {$match:{user:ObjectId(orderDetails.user)}},

                {$unwind:'$cartItems'},

                {$project:{products:'$cartItems.productId', quantity:'$cartItems.quantity'}},

                {$lookup:{from:'products', localField:'products', foreignField:'_id', as:'productDetails'}},

                {$unwind:'$productDetails'},

                {$project:{_id:'$productDetails._id', quantity:1, productName:'$productDetails.productname', price:'$productDetails.price'}}

            ])
            //   console.log(productDetails);

            let Address= await schema.address.aggregate([
                {$match:{user:ObjectId(orderDetails.user)}},

                {$unwind:'$address'},

                {$project:{address:'$address'}},

                {$match:{'address._id':ObjectId(orderDetails.address)}},

                {$project:{address:'$address'}}



                // {$match:{'$address':orderDetails.address}}

            ])
            console.log("11111111111");
            console.log(Address[0].address);
            console.log("11111111111");


            let orderAddress=Address[0].address;

            let paymentStatus=orderDetails.paymentMethod==='COD'? 'pending' : 'pending'

            // console.log(paymentStatus);
            


            let orderData={
                fname:orderAddress.fname,
                lname:orderAddress.lname,
                productDetails:productDetails,
                paymentMethod:orderDetails.paymentMethod,
                paymentStatus:paymentStatus,
                totalAmount:totalAmount,
                shippingAddress:orderAddress,

            }


            let order= await schema.order.findOne({user:orderDetails.user})

            if(order){
                await schema.order.updateOne(
                    {user:orderDetails.user},
                    {$push:{orders:orderData}}).then((response)=>{


                        resolve(response)
                    })
            }else{

                let newOrder= schema.order({
                    user:orderDetails.user,
                    orders:orderData

                })

                await newOrder.save().then((response)=>{

                })
            }

            await schema.cart.deleteMany({user:orderDetails.user}).then(()=>{

                resolve()
            })

        })

        
    }


    
}