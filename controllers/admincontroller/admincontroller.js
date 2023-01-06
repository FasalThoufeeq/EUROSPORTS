



const adminCredential={
    name:'admin',
    email:'admin@gmail.com',
    password:'admin12345'
   }

   let admin,adminStatus;

module.exports={


    ///get Dashboard
    getDashboard:(req,res)=>{

        admin=req.session.admin
        if(req.session.adminloggedIn==true){

            res.render("admin/admin-dashboard",{layout:"adminLayout",admin})
        }else{

            res.render("admin/login",{layout:"adminLayout"})
        }

    },


    //get admin login
    getAdminLogin:(req,res)=>{

         admin=req.session.admin
        if(req.session.adminloggedIn==true){
            res.render("admin/admin-dashboard",{layout:"adminlayout",admin})
        }else{

            res.render("admin/login",{layout:"adminLayout"})
        }
    },


    //post admin login
    postAdminLogin:(req,res)=>{
        // console.log(req.body);
        if(req.body.email==adminCredential.email && req.body.password==adminCredential.password){
            req.session.adminloggedIn=true;

            adminStatus=req.session.adminloggedIn

            req.session.admin=adminCredential
            res.render("admin/admin-dashboard",{layout:"adminLayout",adminStatus})
        }else{
        
            res.render("admin/login",{layout:"adminLayout",adminStatus})
        }
    },


    //get admin logout
    getAdminLogout:(req,res)=>{
        req.session.adminloggedIn=false;
        adminStatus=req.session.adminloggedIn
        res.render("admin/login",{layout:"adminLayout",adminStatus})
    }
}