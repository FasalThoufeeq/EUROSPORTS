const { response } = require("../../app");
const userSchema= require("../../models/connection");






module.exports={
    // get user view
    getUserView:()=>{
        return new Promise(async(resolve, reject) => {
            
            let userDetails=[];
            await userSchema.user.find().exec().then((result)=>{
                console.log(result);
                userDetails=result;
                resolve(userDetails)

            })
        })
    },


    //get block
    getUserBlock:(Id)=>{
        console.log("id vannoohe");
        return new Promise(async(resolve, reject) => {
            await userSchema.user.updateOne({_id:Id},{$set:{blocked:true}}).then((response)=>{
                console.log("ok");
                resolve(response);
            })
        })
    },


    //get unblock

    getUserUnblock:(Id)=>{
        return new Promise(async(resolve, reject) => {
            await userSchema.user.updateOne({_id:Id},{$set:{blocked:false}}).then((response)=>{
                resolve(response)
            })
        })
    }


} 