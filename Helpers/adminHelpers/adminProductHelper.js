const db=require('../../config/connection')
const collection=require('../../config/collections');
const {ObjectId}=require('mongodb-legacy');
const { resolve } = require('promise');
const voucher_codes = require("voucher-code-generator");


module.exports={

    //get product view
    getViewProduct:()=>{
        return new Promise(async(resolve, reject) => {
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([{
                        $lookup:{
                        from:'category',
                        localField:'category',
                        foreignField:'_id',
                        as:'catDetails'
                    }
                }]).toArray()
                console.log(products);
                resolve(products)

        })
    },

    //get add product
    getAddProduct:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).find().toArray().then((categorys)=>{
                resolve(categorys)
            })
        })
    },

    //post add product
    addProducts:(products)=>{
        return new Promise(async(resolve, reject) => {
            products.price=Number(products.price)
            products.quantity=Number(products.quantity)
            products.list=true
            let category=await db.get().collection(collection.CATEGORY_COLLECTION).findOne({categoryname:products.category})
            products.category=category._id


            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(products).then((productDetails)=>{
                // console.log(productDetails.insertedId)
                resolve(productDetails.insertedId)
            })
        })
    },

    addProductImage:(productId,imgUrls)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(productId)},{$set:{image:imgUrls}})
    },

    //get add category
    getAddCategory:()=>{
        return new Promise(async(resolve, reject) => {
            let category=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            console.log(category);
            
            resolve(category)
        })

    },

    //post category
    postAddCategory:(category)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(category).then(()=>{

                resolve()
            })
        })
        
    },

    editCatergory:(categoryId)=>{
        // console.log(categoryId+"zass");
        return new Promise(async(resolve, reject) => {
            await db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:new ObjectId(categoryId)}).then((response)=>{
                console.log('res',response);
                resolve(response)
            })
                
        })
    },

    //post edited category
    postEditCategory:(categoryname,categoryId)=>{
        // console.log(categoryname,categoryId);
        return new Promise(async(resolve, reject) => {
            await db.get().collection(collection.CATEGORY_COLLECTION).updateOne({_id:new ObjectId(categoryId)},{$set:{categoryname:categoryname}}).then(()=>{
                resolve()
            })
        })
    },

    //delete category
    deleteCategory:(categoryId)=>{
        console.log(categoryId);
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:new ObjectId(categoryId)}).then(()=>{
                resolve()
            })
        })
    },

    //get edit ptoduct
    getEditProduct:(productId)=>{
        return new Promise((resolve, reject) => {
            
           let product= db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new ObjectId(productId)})
           resolve(product)
        })
    },

    //post edit product
    postEditProduct:(productId,editedDetails)=>{
        return new Promise((resolve, reject) => {
            editedDetails.price=Number(editedDetails.price)
            editedDetails.quantity=Number(editedDetails.quantity)
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(productId)},{$set:{productname:editedDetails.productname,description:editedDetails.description,price:editedDetails.price,quantity:editedDetails.quantity,category:new ObjectId(editedDetails.category)}}).then(()=>{
                resolve()
            })
            
        })
    },

    //list
    listProduct:(productId)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(productId)},{$set:{list:true}}).then(()=>{
            resolve()
        })
    },
    //unlist
    unlistProduct:(productId)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(productId)},{$set:{list:false}}).then(()=>{
            resolve()
        })
    },


    getOrdersList:()=>{
        return new Promise(async(resolve, reject) => {
            let orders=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {$unwind:'$orders'},

                {$sort:{'orders.orderedDate':-1}}
            ]).toArray()
            console.log(orders,'asdfghjkl');
            resolve(orders)
        })
    },

    getOrderDetails:(OrderId)=>{
        return new Promise(async(resolve, reject) => {
            let order=await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {$match:{'orders._id':new ObjectId(OrderId)}},

                {$unwind:"$orders"},

                {$match:{'orders._id':new ObjectId(OrderId)}}
            ]).toArray()
            
            // console.log(order);
            resolve(order)
        })
    },

    postOrderDetails:(body,OrderId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).updateOne({'orders._id':new ObjectId(OrderId)},{$set:{'orders.$.orderStatus':body.status}})
            .then(()=>{
                resolve()
            })
        })
    },

    postBannner:(texts)=>{
        return new Promise((resolve, reject) => {

            let bannerObj={
                title:texts.title,
                description:texts.description,
                link:texts.link
            }
            db.get().collection(collection.BANNER_COLLECTION).insertOne(bannerObj).then((bannerDrtails)=>{
                resolve(bannerDrtails.insertedId)
            })
        })
    },

    addBannerImg:(imageUrl,bannerId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BANNER_COLLECTION).updateOne({_id:new ObjectId(bannerId)},{$set:{image:imageUrl}})
        })
    },

    getAllBanner:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BANNER_COLLECTION).find().toArray().then((banners)=>{
                resolve(banners)
            })
        })
    },

    editBanner:(texts,bannerId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.BANNER_COLLECTION).updateOne({_id:new ObjectId(bannerId)},{$set:{title:texts.title,description:texts.description,link:texts.link}}).then(()=>{
                resolve()
            })
        })
    },

    productsCount:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).find().toArray().then((products)=>{
                resolve(products)
            })
        })
    },

    orderByCOD:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {$unwind:'$orders'},

                {$match:{'orders.paymentMethod':'COD'}}
            ]).toArray().then((orderByCOD)=>{
                resolve(orderByCOD)
            })
        })
    },


    orderByRazorpay:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {$unwind:'$orders'},

                {$match:{'orders.paymentMethod':'Razorpay'}}
            ]).toArray().then((orderByRazorpay)=>{
                resolve(orderByRazorpay)
            })
        })
    },

    getOrderByDate:()=>{
        return new Promise((resolve, reject) => {
            const startDate=new Date('2022-01-01')
            db.get().collection(collection.ORDER_COLLECTION).find({'orders.orderedDate':{$gte:startDate}}).toArray().then((orderDate)=>{
                resolve(orderDate)
            })
        })
    },


    getAllOrders:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {$unwind:'$orders'},

                {$match:{$or:[{'orders.orderStatus':'Success'},{'orders.orderStatus':'Delivered'}]}}
            ]).toArray().then((response)=>{
                resolve(response)
            })
        })
    },

    categorys:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).find().toArray().then((categorys)=>{
                resolve(categorys)
            })
        })
    },

    generateCoupon:()=>{
        return new Promise((resolve, reject) => {
            try {
                let couponCode = voucher_codes.generate({
                  length: 6,
                  count: 1,
                  charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                  prefix: "WHITE-",
                });
                resolve({ status: true, couponCode: couponCode[0] });
              } catch (err) {
                console.log(err);
              }
        })
    },

    addCoupon:(data)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.COUPON_COLLECTION).insertOne(data).then(()=>{
                resolve({status:true})
            })
        })
    },

    getAllCoupon:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.COUPON_COLLECTION).find().toArray().then((coupons)=>{
                resolve(coupons)
            })
        })
    },

    deleteCoupon:(couponId)=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.COUPON_COLLECTION).deleteOne({_id:new ObjectId(couponId)}).then((response)=>{
                resolve(response)
            })
        })
    },

    getReport:()=>{
        return new Promise((resolve, reject) => {
            db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {$unwind:'$orders'},

                {$match:{$or:[{'orders.orderStatus':'Delivered'},{'orders.orderStatus':'Success'}]}}
            ]).toArray().then((report)=>{
                resolve(report)
            })
        })
    },

    postSalesPeriod:(body)=>{
        return new Promise((resolve, reject) => {
            let start=new Date(body.startdate)
            let end=new Date(body.enddate)
            db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {$unwind:'$orders'},

                {$match:{$or:[{'orders.orderStatus':'Delivered'},{'orders.orderStatus':'Success'}],'orders.orderedDate':{$gte:start , $lte:end}}}
            ]).toArray().then((report)=>{
                resolve(report)
            })
        })
    }
}