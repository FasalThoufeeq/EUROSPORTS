const adminUserHelper = require("../../Helpers/adminHelpers/adminUserHelper");

module.exports = {
  //get user view
  getUserView: (req, res) => {
    try {
      adminUserHelper
        .getUsersList()
        .then((users) => {
          res.render("admin/view-users", { layout: "admin-layout", users });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  //blockUser
  getUserBlock: (req, res) => {
    try {
      adminUserHelper
        .blockUser(req.params.id)
        .then(() => {
          res.redirect("/admin/view-users");
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  //unBlock user
  getUserUnblock: (req, res) => {
    try {
      adminUserHelper
        .UnBlockUser(req.params.id)
        .then(() => {
          res.redirect("/admin/view-users");
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },
};
