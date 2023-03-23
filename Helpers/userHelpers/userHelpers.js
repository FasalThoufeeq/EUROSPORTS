const db=require('../../config/connection')
const collection=require('../../config/collections')
const bcrypt=require('bcrypt')
const { response } = require('../../app')


module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve, reject) => {

            userData.blocked=Boolean(userData.blocked)
            userData.phone=Number(userData.phone)

            let emailExist=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            let phoneExist=await db.get().collection(collection.USER_COLLECTION).findOne({phone:userData.phone})

            if(emailExist || phoneExist){
                resolve({status:false})
            }else{
                userData.password=await bcrypt.hash(userData.password,10)
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((response)=>{
                    resolve({response,status:true})
                })
            }

            
        })
    },


    doLogin:(userData)=>{
        // console.log(userData);
        return new Promise(async(resolve, reject) => {
            // let loggedInStatus=false
            // let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            // console.log(user)
            if(user){
                console.log("user");
                if(user.blocked==false){
                    bcrypt.compare(userData.password,user.password).then((status)=>{
                        if(status){
                            let username=user.name
                            resolve({loggedInStatus:true,username,user})
                            
                        }else{
                            resolve({loggedInStatus:false})
                        }
                    })
                }else{
                    resolve({blockedStatus:true})
                }
                
            }else{
                resolve({loggedInStatus:false})
            }
        })
    },

    numberExist:(number)=>{
        return new Promise(async(resolve, reject) => {
            number=Number(number)
           let user=await db.get().collection(collection.USER_COLLECTION).findOne({phone:number})
        //    console.log(user);
           resolve(user)
        })
    },

    changePass:(changedDetails)=>{
        return new Promise(async(resolve, reject) => {
            let emailExist=await db.get().collection(collection.USER_COLLECTION).findOne({email:changedDetails.email})
            console.log(emailExist);
            if(emailExist){
                let newPassword=await bcrypt.hash(changedDetails.password,10)
                db.get().collection(collection.USER_COLLECTION).updateOne({email:changedDetails.email},{$set:{password:newPassword}})
                resolve({changed:true})
            }else{
                resolve({changed:false})
            }
        })
    }

}