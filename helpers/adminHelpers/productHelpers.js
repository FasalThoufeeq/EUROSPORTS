const { response } = require("../../app");
const schema=require("../../models/connection");
const multer=require("../../multer/multer")





module.exports={
    // view product
    viewProduct:()=>{
        return new Promise(async(resolve, reject) => {
            
            await schema.product.find().exec().then((data)=>{

                resolve(data);
            })
        })
    },

    //get add product
    getAddProduct:()=>{
        return new Promise(async(resolve, reject) => {
            
            await schema.category.find().exec().then((data)=>{
                resolve(data)
            })

        })
    },


    postAddProduct:(productDetails,filename)=>{
        return new Promise(async(resolve, reject) => {
            
            const addedProduct= new schema.product({
                productname:productDetails.productname,
                description:productDetails.description,
                price:productDetails.price,
                category:productDetails.category,
                quantity:productDetails.quantity,
                image:filename
            })

            await addedProduct.save().then((data)=>{

                resolve(data)
            })
        })
    },



    //delete product

    deleteProduct:(Id)=>{
        return new Promise(async(resolve, reject) => {


            await schema.product.deleteOne({_id:Id}).then((response)=>{

                resolve(response)
            })
        })
    },


    //get edit product

    getEditProduct:(Id)=>{

        return new Promise(async(resolve, reject) => {
            
            await schema.product.findOne({_id:Id}).exec().then((response)=>{

                resolve(response)

            })
        })

    },


    //post edit product

    postEditProduct:(Id,editedData,filename)=>{
        return new Promise(async(resolve, reject) => {
            

            await schema.product.updateOne({_id:Id},{$set:{
                productname:editedData.productname,
                description:editedData.description,
                price:editedData.price,
                category:editedData.category,
                quantity:editedData.quantity,
                image:filename

            }}).then((response)=>{


                resolve(response)
            })
        })
    },




       // from adminCategoryHelpers
       viewCategory:()=>{

        return new Promise(async(resolve, reject) => {
            await schema.category.find().exec().then((response)=>{
            
                resolve(response);
            })
        })

    },







    


}