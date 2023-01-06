const { response } = require("../../app");
const schema=require("../../models/connection");







module.exports={

    //get Category
    viewCategory:()=>{

        return new Promise(async(resolve, reject) => {
            await schema.category.find().exec().then((response)=>{
            
                resolve(response);
            })
        })

    },


    //post category
    addCategory:(userData)=>{
        return new Promise(async(resolve, reject) => {
            
            let category=new schema.category({
                
                categoryname: userData.categoryname
            })

            console.log(category);
           await category.save().then((data)=>{

            resolve(data)
           })

        })
    },




    //get edit edit category

    getEditCategory:(categoryId)=>{

        return new Promise(async(resolve, reject) => {
            
            await schema.category.find({_id:categoryId}).exec().then((response)=>{

                resolve(response)
            })
        })
    },



    //post edited category name

    postEditCategory:(Id,editedName)=>{
        return new Promise(async(resolve, reject) => {
            
            await schema.category.updateOne({_id:Id},{$set:{categoryname:editedName}}).then((response)=>{

                resolve(response);
            })
        })
    },


    // delete category

    deleteCategory:(Id)=>{
        return new Promise(async(resolve, reject) => {
            
            await schema.category.deleteOne({_id:Id}).then((data)=>{
                
                resolve(data)
            })
        })
    },




 



}