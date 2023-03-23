module.exports={
    adminAuthentication:(function(req,res,next){


        if(req.session.adminLoggedIn){
           next()
        }else{
        //  console.log("authentication");
          res.redirect('/admin/admin-login')
        }
       
    }),
     
  }