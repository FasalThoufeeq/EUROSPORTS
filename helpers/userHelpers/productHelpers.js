const { response } = require("../../app")
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

    }


    
}