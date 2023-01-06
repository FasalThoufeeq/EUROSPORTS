const { response } = require("../../app");
const userViewHelpers=require("../../helpers/adminHelpers/userViewHelpers");





module.exports={

    //get user view
    getUserView:(req,res)=>{
        let admin=req.session.admin
        let adminStatus=req.session.adminloggedIn
        userViewHelpers.getUserView().then((users)=>{
            res.render("admin/view-users",{layout:"adminLayout" ,users,admin,adminStatus})
        })
    },

    // to block
    getUserBlock:(req,res)=>{

        userViewHelpers.getUserBlock(req.params.id).then((response)=>{
            res.redirect("/admin/view_users")
        })

    },


    //to unblock

    getUserUnblock:(req,res)=>{
        userViewHelpers.getUserUnblock(req.params.id).then((response)=>{
          res.redirect("/admin/view_users")
        })
    }
}