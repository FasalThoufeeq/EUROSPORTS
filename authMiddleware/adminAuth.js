

module.exports = {
  adminAuthentication: function (req, res, next) {
    if (req.session.adminLoggedIn) {
      next();
    } else {
      res.redirect("/admin/admin-login");
    }
  },
};
