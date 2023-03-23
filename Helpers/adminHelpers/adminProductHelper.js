const db=require('../../config/connection')
const collection=require('../../config/collections');
const {ObjectId}=require('mongodb-legacy');
const { resolve } = require('promise');


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
            // console.log(editedDetails.category);
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:new ObjectId(productId)},{$set:{productname:editedDetails.productname,description:editedDetails.description,price:editedDetails.price,quantity:editedDetails.quantity,category:editedDetails.category}}).then(()=>{
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
            // console.log(orders);
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
    }
}