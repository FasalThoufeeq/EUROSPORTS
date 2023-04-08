const adminUserHelper = require("../../Helpers/adminHelpers/adminUserHelper");

module.exports = {
  //get user view
  getUserView: (req, res) => {
    adminUserHelper.getUsersList().then((users) => {
      res.render("admin/view-users", { layout: "admin-layout", users });
    });
  },

  //blockUser
  getUserBlock: (req, res) => {
    adminUserHelper.blockUser(req.params.id).then(() => {
      res.redirect("/admin/view-users");
    });
  },

  //unBlock user
  getUserUnblock: (req, res) => {
    adminUserHelper.UnBlockUser(req.params.id).then(() => {
      res.redirect("/admin/view-users");
    });
  },
};
