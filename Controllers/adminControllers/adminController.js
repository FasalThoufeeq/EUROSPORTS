const adminHelpers=require('../../Helpers/adminHelpers/adminHelpers')


const adminCredential={
    name:'admin',
    email:'admin@gmail.com',
    password:'admin12345'
}

    let adminStatus,admin;

module.exports={

    // get dashboard
    getDashboard:(req,res)=>{
        admin=req.session.admin
        if(req.session.adminLoggedIn==true){

            res.render('admin/dashboard',{layout:'admin-layout',admin})
        }else{
            res.redirect('/admin/admin-login')
        }
    },

    //GET LOGIN
    getAdminLogin:(req,res)=>{
        admin=req.session.admin
        if(req.session.adminLoggedIn==true){
            res.redirect('/admin')
        }else{

            res.render('admin/adminlogin',{adminloginpage:true})
        }
    },


    //POST ADMIN LOGIN
    postAdminLogin:(req,res)=>{
        if(req.body.email==adminCredential.email && req.body.password==adminCredential.password){
            req.session.adminLoggedIn=true

            adminStatus=req.session.adminLoggedIn
            req.session.admin=adminCredential

            res.redirect('/admin')

        }else{
            res.redirect('/admin/admin-login')
        }
    },


    //GET LOGOUT
    getAdminLogout:(req,res)=>{
        req.session.adminLoggedIn=false
        adminStatus=req.session.adminLoggedIn
        res.redirect('/admin/admin-login')
    }

}