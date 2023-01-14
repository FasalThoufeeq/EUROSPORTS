const bcrypt=require("bcrypt")
const userSchema= require("../../models/connection")
var { response } = require("../../app");
const { resolve } = require("promise");
const { Schema } = require("mongoose");



 module.exports={
    //post signup
    postSignUp:(userData)=>{
        // console.log(userData);
        //  let response={};
        return new Promise(async(resolve, reject) => {

            try{

                
                let userexisting=await userSchema.user.findOne({email:userData.email})
                let userexistingphone=await userSchema.user.findOne({number:userData.number})
                // console.log(userexisting);
                if(userexisting||userexistingphone){

                    
                    resolve({status:false})

            
                }else{
                    var hashedPassword=await bcrypt.hash(userData.password,10);
                    // console.log(hashedPassword)
                    let userDatas=userSchema.user({
                    username:userData.username,
                    email:userData.email,
                    password:hashedPassword,
                    number:userData.number
                    })
                    // console.log(userDatas)
                    await userDatas.save().then((data)=>{
                        
                    resolve({data,status:true})
                    // console.log(data);
                    })
                }


            }catch(err){

                console.log(err);

            }

        })
    },



    //post login
    postLogin:(userData)=>{
        // console.log(userData);
        return new Promise(async(resolve, reject) => {

            try{

                // let response={};

                let loginUser = await userSchema.user.findOne({email:userData.email})
                // console.log(loginUser);
                // console.log(loginUser)
                if(loginUser){ 
                    if(loginUser.blocked==false){
                        await bcrypt.compare(userData.password,loginUser.password).then((status)=>{
                            if(status){
                                let  username=loginUser.username;
                                resolve({loggedInStatus:true,username,loginUser})
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

            }catch(err){
                console.log(err);
            }
        })
    },


    // post Address

    postAddress:(address,userId)=>{

        console.log(userId);

        let addressObj={

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


        let addressExist = await userSchema.address.findOne({user:userId})
        if (addressExist) {


          await userSchema.address.updateOne({ user: userId },
            {
              "$push":
              {
                "address": addressObj

              }
            }).then((response) => {
              console.log(response);
              resolve(response)
            })



        }else{
            
            let addAddress= new userSchema.address({

                user:userId,
                address:addressObj

            })

            addAddress.save().then((response)=>{

                resolve(response)
            })
        }
            
        })

    }
}







