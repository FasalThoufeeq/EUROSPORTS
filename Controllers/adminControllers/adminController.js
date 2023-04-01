const adminHelpers = require("../../Helpers/adminHelpers/adminHelpers");
const adminProductHelper=require("../../Helpers/adminHelpers/adminProductHelper")

const adminCredential = {
  name: "admin",
  email: "admin@gmail.com",
  password: "admin12345",
};

let adminStatus, admin;

module.exports = {
  // get dashboard
  getDashboard:async (req, res) => {
    admin = req.session.admin;
    let productsCount
    let days=[]
    let ordersPerDay={}
    let paymentCount = []
    let products=await adminProductHelper.productsCount()
    productsCount=products.length
    console.log(productsCount,'pcount');

    let orderByCOD=await adminProductHelper.orderByCOD()
    let codCount=orderByCOD.length
    console.log(codCount,'c count');

    let orderByRazorpay=await adminProductHelper.orderByRazorpay()
    let RazorpayCount=orderByRazorpay.length
    console.log(RazorpayCount);

    paymentCount.push(codCount)
    paymentCount.push(RazorpayCount)

    let categorys=await adminProductHelper.categorys()
    let categoryCount=categorys.length

    await adminProductHelper.getOrderByDate().then((response)=>{
      if(response.length>0){
        console.log(response);
        let result=response[0]?.orders
        for(let i=0;i<result.length;i++){
          let ans={}
          ans['orderedDate']=result[i].orderedDate
          days.push(ans)
          ans={}
        }
      }
      console.log(days,"day");

      days.forEach((order)=>{
        const day = order.orderedDate.toLocaleDateString('en-US', { weekday: 'long' });
        ordersPerDay[day] = (ordersPerDay[day] || 0) + 1;
        // console.log(day,'day');
        console.log(ordersPerDay);
      })
    })

    adminProductHelper.getAllOrders().then((response)=>{
      let orderCount=response.length

      let total=0
      for(let i=0;i<orderCount;i++){
        total+=response[i].orders.totalAmount
      }
      console.log(total);

      res.render("admin/dashboard", { layout: "admin-layout", admin ,orderCount,total,ordersPerDay,paymentCount,productsCount,categoryCount});
    })


  },

  //GET LOGIN
  getAdminLogin: (req, res) => {
    admin = req.session.admin;
    if (req.session.adminLoggedIn == true) {
      res.redirect("/admin");
    } else {
      res.render("admin/adminlogin", { adminloginpage: true });
    }
  },

  //POST ADMIN LOGIN
  postAdminLogin: (req, res) => {
    if (
      req.body.email == adminCredential.email &&
      req.body.password == adminCredential.password
    ) {
      req.session.adminLoggedIn = true;

      adminStatus = req.session.adminLoggedIn;
      req.session.admin = adminCredential;

      res.redirect("/admin");
    } else {
      res.redirect("/admin/admin-login");
    }
  },

  //GET LOGOUT
  getAdminLogout: (req, res) => {
    req.session.adminLoggedIn = false;
    adminStatus = req.session.adminLoggedIn;
    res.redirect("/admin/admin-login");
  },
};
