const { response } = require("../../app");
const categoryHelper=require("../../helpers/adminHelpers/adminCategoryHelpers");





module.exports={


    //get category
    getCategory:(req,res)=>{

        let admin=req.session.admin
        let adminStatus=req.session.adminloggedIn
        categoryHelper.viewCategory().then((response)=>{

            res.render("admin/add-category",{layout:"adminLayout",response,admin,adminStatus});

        })
    },


    //post category

    postCategory:(req,res)=>{
        console.log("start");
        console.log(req.body);
        console.log("stop");
        categoryHelper.addCategory(req.body).then((data)=>{

            res.redirect("/admin/add_category")
        })
    },



    //get edit category

    editCategory:(req,res)=>{
        // console.log(req.body + "hey");
        let admin=req.session.admin
        categoryHelper.getEditCategory(req.params.id).then((response)=>{
            const [category]=response
            res.render("admin/edit-category",{layout:"adminLayout",category,admin,adminStatus})
        })
    },



    //post edit category

    postEditCategory:(req,res)=>{
        console.log(req.body.editcategoryname);
        categoryHelper.postEditCategory(req.params.id,req.body.editcategoryname).then((response)=>{
            
            res.redirect("/admin/add_category");
        })
    },



    //delete category

    deleteCategory:(req,res)=>{
        categoryHelper.deleteCategory(req.params.id).then((data)=>{

            res.redirect("/admin/add_category");

        })
    }

}