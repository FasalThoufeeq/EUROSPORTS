const { response, render } = require("../../app");
const userHelpers = require("../../Helpers/userHelpers/userHelpers");
const productHelper = require("../../Helpers/userHelpers/userProduct");
const adminProductHelper = require("../../Helpers/adminHelpers/adminProductHelper");
const otp = require("../../utils/otp");
const client = require("twilio")(otp.accountSID, otp.authToken);

let cartCount, wishCount, username;
module.exports = {
  //get Home
  getUserHome: async (req, res) => {
    if (req.session.loggedIn) {
      username = req.session.user.name;
      wishCount = await productHelper.getWishCount(req.session.user._id);
      cartCount = await productHelper.getCartCount(req.session.user._id);
      let banner = await adminProductHelper.getAllBanner();

      res.render("user/home", {
        username,
        wishCount,
        cartCount,
        loggedInStatus: true,
        banner,
      });
    } else {
      let banner = await adminProductHelper.getAllBanner();
      res.render("user/home", { loggedInStatus: false, banner });
    }
  },

  //get login
  getUserLogin: (req, res) => {
    if (req.session.loggedIn == true) {
      res.redirect("/");
    } else {
      res.render("user/login");
    }
  },

  postLogin: (req, res) => {
    userHelpers.doLogin(req.body).then((response) => {
      let loggedInStatus = response.loggedInStatus;
      let blockedStatus = response.blockedStatus;
      let username = response.username;

      if (loggedInStatus == true) {
        req.session.loggedIn = true;
        req.session.user = response.user;

        res.redirect("/");
      } else {
        res.render("user/login", { loggedInStatus, blockedStatus });
      }
    });
  },

  getSignup: (req, res) => {
    if (req.session.loggedIn == true) {
      res.redirect("/");
    } else {
      res.render("user/signup");
    }
  },

  postSignup: (req, res) => {
    userHelpers.doSignup(req.body).then((response) => {
      let emailStatus = response.status;

      if (emailStatus == true) {
        res.redirect("/login");
      } else {
        res.render("user/signup", { emailStatus });
      }
    });
  },

  //logout
  getLogout: (req, res) => {
    req.session.loggedIn = false;
    req.session.user = null;
    res.redirect("/login");
  },

  //get number field
  getNumber: (req, res) => {
    res.render("user/number");
  },

  // post number
  postNumber: async (req, res) => {
    let number = req.body.number;
    req.session.number = number;
    let users = await userHelpers.numberExist(number);

    if (users == false) {
      res.render("user/number", { userExist: false });
    } else {
      client.verify.v2
        .services(otp.serviceId)
        .verifications.create({ to: `+91 ${number}`, channel: "sms" })
        .then(() => {
          let readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout,
          });
        });
    }
    res.render("user/otp");
  },

  //get otp page
  getOTP: (req, res) => {
    res.render("user/otp");
  },

  //post otp page
  postOtp: async (req, res) => {
    let otpnumber = req.body.otp;
    let number = req.session.number;

    await client.verify.v2
      .services(otp.serviceId)
      .verificationChecks.create({ to: `+91 ${number}`, code: otpnumber })
      .then((verificationChecks) => {
        if (verificationChecks.valid) {
          res.redirect("/change-password");
        } else {
          res.render("user/otp", { wrongOTP: true });
        }
      });
  },

  getchangePass: (req, res) => {
    res.render("user/change-password");
  },

  postchangePass: (req, res) => {
    userHelpers.changePass(req.body).then((response) => {
      if (response.changed == true) {
        res.redirect("/login");
      } else {
        res.render("user/change-password", { changed: false });
      }
    });
  },

  getProfile: (req, res) => {
    userHelpers.getProfile(req.session.user._id).then(async (userData) => {
      username = req.session.user.name;
      wishCount = await productHelper.getWishCount(req.session.user._id);
      cartCount = await productHelper.getCartCount(req.session.user._id);

      res.render("user/profile", {
        username,
        wishCount,
        cartCount,
        loggedInStatus: true,
        userData,
      });
    });
  },

  updateProfile: (req, res) => {
    userHelpers.updateProfile(req.body, req.params.id).then((data) => {
      res.json({ data });
    });
  },

  resetPassword: (req, res) => {
    userHelpers
      .resetPassword(req.body, req.session.user._id)
      .then((response) => {
        if (response) {
          res.json(true);
        } else {
          res.json(false);
        }
      });
  },

  getAddress: async (req, res) => {
    username = req.session.user.name;
    wishCount = await productHelper.getWishCount(req.session.user._id);
    cartCount = await productHelper.getCartCount(req.session.user._id);
    let storedAddress = await productHelper.storedAddress(req.session.user._id);
    res.render("user/address", {
      username,
      wishCount,
      cartCount,
      loggedInStatus: true,
      storedAddress,
    });
  },

  postAddress: (req, res) => {
    productHelper.postAddAddress(req.body, req.session.user._id).then(() => {
      res.redirect("/getAddress");
    });
  },

  deleteAddress: (req, res) => {
    userHelpers
      .deleteAddress(req.body, req.session.user._id)
      .then((response) => {
        res.json(response);
      });
  },
};
