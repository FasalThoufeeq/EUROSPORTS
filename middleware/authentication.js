module.exports={
    adminAuthentication:(function(req,res,next){
        if(req.session.adminloggedIn){
          next()
        }else{
          res.render('admin/login',{layout:'adminlayout'})
        }
       
      }),
      userAuthentication:(function(req,res,next){
        if(req.session.loggedIn){
          next()
        }else{
          res.render('user/login')
        }
       
      })
    
    
  }