const { response } = require("../../app")
const userHelpers=require("../../helpers/userHelpers/userHelpers")
const schema=require("../../models/connection")
const otp=require("../../otp/otp")
const client=require("twilio")(otp.accountSID,otp.authToken)

let loggedInStatus,blockedStatus,emailStatus,number;


module.exports={


    //get Home
    getUserHome: (req,res)=>{
        res.render("user/user")
    },




    //get signup
    getUserSignUp: (req,res)=>{

        emailStatus=true;
        if(req.session.loggedIn){

            res.redirect("/")
        }else{

            res.render("user/signup",{layout:"layout"})
        }
    },




    //post signup
    postUserSignUp: async(req,res)=>{
        //console.log(req.body)
        userHelpers.postSignUp(req.body).then((response)=>{
            // console.log(response)
            // req.session.loggedIn=true;

             emailStatus = response.status;

            if(emailStatus==true){
                
                res.redirect("/login")
               
            }else{
                 res.render("user/signup",{emailStatus})

            }

            
        })
    },

    


    //get login
    getUserLOgin:(req,res)=>{

        if(req.session.loggedIn){
            res.redirect("/")
        }else{

            res.render("user/login")
        }
        
    },




    //post login
    postUserlogin:(req,res)=>{
        userHelpers.postLogin(req.body).then((response)=>{

            req.session.loggedIn=true;
            
            

            
            

              loggedInStatus=response.loggedInStatus;
              blockedStatus=response.blockedStatus;

            if(loggedInStatus==true){
                
                req.session.user=response.loginUser;
                // console.log(req.session.user._id+"ok");
                res.redirect("/")
            }else{
                res.render("user/login",{loggedInStatus,blockedStatus})
            }

        })
    
    },



    //logout

    getLogout:(req,res)=>{

        req.session.loggedIn=false;

        res.redirect("/login")
    },



    //get number page
    getNumber:(req,res)=>{
        res.render("user/mobile")
    },


    // post number
    postNumber:async(req,res)=>{
        // console.log(req.body);
        number = req.body.number;
        // console.log(number)
        let users =  await schema.user.find({number:number}).exec()
        // console.log(users);
          if(users == false){
            res.render('user/mobile',{userExist:false})
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
        
        await client.verify.v2.services(otp.serviceId)
        .verificationChecks.create({to:`+91 ${number}`,code:otpnumber})
        .then((verificationChecks)=>{
            console.log(verificationChecks);
            if(verificationChecks.valid){
         
                res.redirect('/')
            }else{
                res.render('user/otp',{wrongOTP:true})
            }
        })
    },
        
    



 
    


    
}