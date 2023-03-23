const db=require('../../config/connection')
const collection=require('../../config/collections');
const { response } = require('../../app');
const {ObjectId}=require('mongodb-legacy')


module.exports={
    //get users liist
    getUsersList:()=>{
        return new Promise(async(resolve, reject) => {

            const users = await db.get().collection(collection.USER_COLLECTION).find().toArray();
            // console.log(users)
            resolve(users);
        })
    },

    //block user
    blockUser:(id)=>{
        console.log(id+"helper");
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION)
            .updateOne(
                {_id:new ObjectId(id)},

                {$set:{blocked:true}})

                .then((response)=>{
                resolve(response)
            })
        })
    },

    UnBlockUser:(id)=>{

        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:new ObjectId(id)},{$set:{blocked:false}}).then((response)=>{
                resolve(response)
            })
        })
    }
}