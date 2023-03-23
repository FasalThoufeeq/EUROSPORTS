const { response } = require('../../app')
const userHelpers=require('../../Helpers/userHelpers/userHelpers')
const otp=require('../../utils/otp')
const client=require("twilio")(otp.accountSID,otp.authToken)



module.exports={


    //get Home
    getUserHome:(req,res)=>{
        if(req.session.loggedIn){
            let username=req.session.user.name
            
            res.render('user/home',{username,loggedInStatus:true})
        }else{
            res.render('user/home',{loggedInStatus:false})
        }
    },

    //get login
    getUserLogin:(req,res)=>{
        if(req.session.loggedIn==true){
            res.redirect('/')
        }else{

            res.render('user/login')
        }
    },

    postLogin:(req,res)=>{
        userHelpers.doLogin(req.body).then((response)=>{

            let loggedInStatus=response.loggedInStatus
            let blockedStatus=response.blockedStatus
            let username=response.username

            if(loggedInStatus==true){
                req.session.loggedIn=true
                req.session.user=response.user
                
                res.redirect('/')
            }else{
                res.render('user/login',{loggedInStatus,blockedStatus})
            }

        
            
        })
    },

    getSignup:(req,res)=>{
        if(req.session.loggedIn==true){
            res.redirect('/')
        }else{

            res.render('user/signup')
        }
    },

    postSignup:(req,res)=>{
        userHelpers.doSignup(req.body).then((response)=>{

            let emailStatus=response.status

            if(emailStatus==true){
                res.redirect('/login')
            }else{
                res.render('user/signup',{emailStatus})
            }
            
        })
        
    },

    //logout
    getLogout:(req,res)=>{
        req.session.loggedIn=false
        req.session.user=null
        res.redirect('/login')
    },


    //get number field
    getNumber:(req,res)=>{
        res.render('user/number')
    },

    // post number
    postNumber:async(req,res)=>{
    // console.log(req.body);
    let number = req.body.number;
    req.session.number=number
    let users = await userHelpers.numberExist(number)
    
        if(users == false){
            res.render('user/number',{userExist:false})
        }else{
            client.verify.v2.services(otp.serviceId)
            .verifications.create({to:`+91 ${number}`,channel:'sms'}).then(()=>{
              let readline =require('readline').createInterface({
                input:process.stdin,
                output:process.stdout
              })
            })
        }
        res.render('user/otp')
    },

    //get otp page
    getOTP:(req,res)=>{

        res.render("user/otp")
    },
    
    
    
     //post otp page
    postOtp:async(req,res)=>{
        // console.log(req.body)
        let otpnumber = req.body.otp
        // console.log(otpnumber);
        let number=req.session.number
            
        await client.verify.v2.services(otp.serviceId)
        .verificationChecks.create({to:`+91 ${number}`,code:otpnumber})
        .then((verificationChecks)=>{
            console.log(verificationChecks);
            if(verificationChecks.valid){
             
                res.redirect('/change-password')
            }else{
                res.render('user/otp',{wrongOTP:true})
            }
        })
    },

    getchangePass:(req,res)=>{
        res.render('user/change-password')
    },

    postchangePass:(req,res)=>{
        // console.log(req.body);
        userHelpers.changePass(req.body).then((response)=>{
            // console.log(changed);
            if(response.changed==true){
                res.redirect('/login')
            }else{
                res.render('user/change-password',{changed:false})
            }
        })
    }

}