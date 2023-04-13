const adminProductHelper = require("../../Helpers/adminHelpers/adminProductHelper");

const adminCredential = {
  name: "admin",
  email: "admin@gmail.com",
  password: "admin12345",
};

let adminStatus, admin;

module.exports = {
  // get dashboard
  getDashboard: async (req, res) => {
    try {
      admin = req.session.admin;
      let productsCount;
      let days = [];
      let ordersPerDay = {};
      let paymentCount = [];
      let products = await adminProductHelper.productsCount();
      productsCount = products.length;

      let orderByCOD = await adminProductHelper.orderByCOD();
      let codCount = orderByCOD.length;

      let orderByRazorpay = await adminProductHelper.orderByRazorpay();
      let RazorpayCount = orderByRazorpay.length;

      paymentCount.push(codCount);
      paymentCount.push(RazorpayCount);

      let categorys = await adminProductHelper.categorys();
      let categoryCount = categorys.length;

      await adminProductHelper
        .getOrderByDate()
        .then((response) => {
          if (response.length > 0) {
            let result = response[0]?.orders;
            for (let i = 0; i < result.length; i++) {
              let ans = {};
              ans["orderedDate"] = result[i].orderedDate;
              days.push(ans);
              ans = {};
            }
          }

          days.forEach((order) => {
            const day = order.orderedDate.toLocaleDateString("en-US", {
              weekday: "long",
            });
            ordersPerDay[day] = (ordersPerDay[day] || 0) + 1;
          });
        })
        .catch(() => {
          res.render("error");
        });

      adminProductHelper
        .getAllOrders()
        .then((response) => {
          let orderCount = response.length;

          let total = 0;
          for (let i = 0; i < orderCount; i++) {
            total += response[i].orders.totalAmount;
          }

          res.render("admin/dashboard", {
            layout: "admin-layout",
            admin,
            orderCount,
            total,
            ordersPerDay,
            paymentCount,
            productsCount,
            categoryCount,
          });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  //GET LOGIN
  getAdminLogin: (req, res) => {
    try {
      admin = req.session.admin;
      if (req.session.adminLoggedIn == true) {
        res.redirect("/admin");
      } else {
        res.render("admin/adminlogin", { adminloginpage: true });
      }
    } catch {
      res.render("error");
    }
  },

  //POST ADMIN LOGIN
  postAdminLogin: (req, res) => {
    try {
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
    } catch {
      res.render("error");
    }
  },

  //GET LOGOUT
  getAdminLogout: (req, res) => {
    try {
      req.session.adminLoggedIn = false;
      adminStatus = req.session.adminLoggedIn;
      res.redirect("/admin/admin-login");
    } catch {
      res.render("error");
    }
  },
};
