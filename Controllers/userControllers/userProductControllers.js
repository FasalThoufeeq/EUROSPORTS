const productHelper = require("../../Helpers/userHelpers/userProduct");


let cartCount, wishCount, username;
let discountAmount, couponTotal, couponCode, couponName;
let paymentId;
module.exports = {
  //get shop
  getShop: async (req, res) => {
    let page = req.query.page;
    let perPage = 9;
    let DocumentCount = await productHelper.shopCount();
    let pagination = Math.ceil(DocumentCount / perPage);
    if (req.session.user) {
      try {
        cartCount = await productHelper.getCartCount(req.session.user._id);
        wishCount = await productHelper.getWishCount(req.session.user._id);
        username = req.session.user.name;
        productHelper
          .getShop(req.params._id, page)
          .then(async (products) => {
            let categories = await productHelper.getAllCategory();
            res.render("user/shop", {
              products,
              cartCount,
              categories,
              username,
              wishCount,
              loggedInStatus: true,
              DocumentCount,
              pagination,
              page,
            });
          })
          .catch(() => {
            res.render("error");
          });
      } catch {
        res.render("error");
      }
    } else {
      try {
        productHelper
          .getShop(req.params._id, page)
          .then(async (products) => {
            let categories = await productHelper.getAllCategory();
            res.render("user/shop", {
              products,
              categories,
              DocumentCount,
              pagination,
              page,
            });
          })
          .catch(() => {
            res.render("error");
          });
      } catch {
        res.render("error");
      }
    }
  },

  getProductDetails: async (req, res) => {
    if (req.session.user) {
      try {
        username = req.session.user.name;
        cartCount = await productHelper.getCartCount(req.session.user._id);
        wishCount = await productHelper.getWishCount(req.session.user._id);
        productHelper
          .getProductDetails(req.params.slug)
          .then((product) => {
            res.render("user/product-details", {
              product,
              cartCount,
              wishCount,
              username,
              loggedInStatus: true,
            });
          })
          .catch(() => {
            res.render("error");
          });
      } catch {
        res.render("error");
      }
    } else {
      try {
        productHelper
          .getProductDetails(req.params.slug)
          .then((product) => {
            res.render("user/product-details", { product });
          })
          .catch(() => {
            res.render("error");
          });
      } catch {
        res.render("error");
      }
    }
  },

  categoryShow: async (req, res) => {
    let page = req.query.page;
    let perPage = 9;
    let DocumentCount = 9;
    let pagination = Math.ceil(DocumentCount / perPage);

    if (req.session.user) {
      try {
        username = req.session.user.name;
        cartCount = await productHelper.getCartCount(req.session.user._id);
        wishCount = await productHelper.getWishCount(req.session.user._id);
        productHelper
          .getShop(req.params.id, page)
          .then(async (products) => {
            let categories = await productHelper.getAllCategory();
            res.render("user/shop", {
              products,
              cartCount,
              wishCount,
              categories,
              loggedInStatus: true,
              username,
              pagination,
              DocumentCount,
              page,
            });
          })
          .catch(() => {
            res.render("error");
          });
      } catch {
        res.render("error");
      }
    } else {
      try {
        productHelper
          .getShop(req.params.id, page)
          .then(async (products) => {
            let categories = await productHelper.getAllCategory();
            res.render("user/shop", {
              products,
              categories,
              pagination,
              DocumentCount,
              page,
            });
          })
          .catch(() => {
            res.render("error");
          });
      } catch {
        res.render("error");
      }
    }
  },

  postSort: async (req, res) => {
    if (req.session.user) {
      try {
        username = req.session.user.name;
        cartCount = await productHelper.getCartCount(req.session.user._id);
        wishCount = await productHelper.getWishCount(req.session.user._id);
        let sortOption = req.body["selectedValue"];
        let categories = await productHelper.getAllCategory();
        productHelper
          .postSort(sortOption)
          .then((products) => {
            res.render("user/shop", {
              products,
              cartCount,
              categories,
              username,
              wishCount,
              loggedInStatus: true,
              DocumentCount: 9,
              pagination: 1,
              page: 1,
            });
          })
          .catch(() => {
            res.render("error");
          });
      } catch {
        res.render("error");
      }
    } else {
      try {
        let sortOption = req.body["selectedValue"];
        let categories = await productHelper.getAllCategory();
        productHelper
          .postSort(sortOption)
          .then((products) => {
            res.render("user/shop", {
              products,
              categories,
              loggedInStatus: true,
              DocumentCount: 9,
              pagination: 1,
              page: 1,
            });
          })
          .catch(() => {
            res.render("error");
          });
      } catch {
        res.render("error");
      }
    }
  },

  getCart: async (req, res) => {
    try {
      username = req.session.user.name;
      let user = req.session.user;
      let subTotal = await productHelper.subTotal(req.session.user._id);
      let totalAmount = await productHelper.totalAmount(req.session.user._id);
      cartCount = await productHelper.getCartCount(req.session.user._id);
      wishCount = await productHelper.getWishCount(req.session.user._id);

      productHelper
        .getCart(req.session.user._id)
        .then((cartList) => {
          res.render("user/cart", {
            totalAmount,
            cartCount,
            wishCount,
            subTotal,
            user,
            cartList,
            username,
            loggedInStatus: true,
          });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  getAddToCart: (req, res) => {
    try {
      productHelper
        .getAddToCart(req.params.id, req.session.user._id)
        .then(() => {
          res.json({ update: true });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  changeQuantity: (req, res) => {
    try {
      productHelper
        .changeQuantity(req.body)
        .then(async (response) => {
          response.totalAmount = await productHelper.totalAmount(
            req.session.user._id
          );
          res.json(response);
        })
        .then(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  removeCart: (req, res) => {
    try {
      productHelper
        .removeCart(req.body)
        .then((response) => {
          res.json(response);
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  getcheckout: async (req, res) => {
    try {
      let storedAddress = await productHelper.storedAddress(
        req.session.user._id
      );
      let totalAmount = await productHelper.totalAmount(req.session.user._id);
      let cartList = await productHelper.getCart(req.session.user._id);
      let subTotal = await productHelper.subTotal(req.session.user._id);
      cartCount = await productHelper.getCartCount(req.session.user._id);
      let DiscountAmount;
      let couponStatus = await productHelper.couponStatus(couponName);
      let status = couponStatus[0]?.coupons?.couponstatus;

      if (couponName && status == false) {
        totalAmount = await productHelper.totalAmount(req.session.user._id);
        totalAmount = totalAmount[0]?.totalAmount;
        DiscountAmount = discountAmount;
      } else {
        DiscountAmount = 0;
        couponTotal = totalAmount[0]?.totalAmount;
        totalAmount = totalAmount[0]?.totalAmount;
      }

      res.render("user/checkout", {
        storedAddress,
        cartCount,
        totalAmount,
        cartList,
        subTotal,
        loggedInStatus: true,
        username,
        DiscountAmount,
        couponTotal,
      });
    } catch {
      res.render("error");
    }
  },

  addAddress: (req, res) => {
    try {
      productHelper
        .postAddAddress(req.body, req.session.user._id)
        .then(() => {
          res.redirect("/checkout");
        })
        .then(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  postOrder: async (req, res) => {
    try {
      let totalAmount = await productHelper.totalAmount(req.session.user._id);
      totalAmount = totalAmount[0]?.totalAmount;
      let DiscountAmount = 0;
      if (couponCode) {
        totalAmount = couponTotal;
        DiscountAmount = discountAmount;
      }
      productHelper
        .postOrders(
          req.body,
          req.session.user._id,
          totalAmount,
          DiscountAmount,
          couponName
        )
        .then(async (response) => {
          if (req.body.paymentMethod == "COD") {
            res.json({ COD: true });
          } else {
            productHelper
              .generateRazorpay(req.session.user._id, totalAmount)
              .then((order) => {
                paymentId = order.id;
                res.json(order);
              });
          }
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  verifyPayment: (req, res) => {
    try {
      productHelper
        .verifyPayment(req.body)
        .then((response) => {
          productHelper
            .changePaymentStatus(
              req.session.user._id,
              req.body["order[receipt]"],
              paymentId
            )
            .then(() => {
              res.json({ status: true });
            });
        })
        .catch((err) => {
          res.json({ status: "payment failed" });
        });
    } catch {
      res.render("error");
    }
  },

  orderSuccess: async (req, res) => {
    try {
      cartCount = await productHelper.getCartCount(req.session.user._id);
      wishCount = await productHelper.getWishCount(req.session.user._id);
      res.render("user/success", {
        cartCount,
        wishCount,
        loggedInStatus: true,
        username,
      });
    } catch {
      res.render("error");
    }
  },

  getOrders: async (req, res) => {
    try {
      const getDate = (date) => {
        let orderDate = new Date(date);
        let day = orderDate.getDate();
        let month = orderDate.getMonth() + 1;
        let year = orderDate.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        return `${isNaN(day) ? "00" : day}-${isNaN(month) ? "00" : month}-${
          isNaN(year) ? "0000" : year
        } ${date.getHours(hours)}:${date.getMinutes(minutes)}:${date.getSeconds(
          seconds
        )}`;
      };
      cartCount = await productHelper.getCartCount(req.session.user._id);
      wishCount = await productHelper.getWishCount(req.session.user._id);
      productHelper
        .getOrders(req.session.user._id)
        .then((orders) => {
          username = req.session.user.name;
          res.render("user/orders", {
            orders,
            cartCount,
            wishCount,
            getDate,
            loggedInStatus: true,
            username,
          });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  getOrderDetails: async (req, res) => {
    try {
      let OrderId = req.query.order;
      const getDate = (date) => {
        let orderDate = new Date(date);
        let day = orderDate.getDate();
        let month = orderDate.getMonth() + 1;
        let year = orderDate.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        return `${isNaN(day) ? "00" : day}-${isNaN(month) ? "00" : month}-${
          isNaN(year) ? "0000" : year
        } ${date.getHours(hours)}:${date.getMinutes(minutes)}:${date.getSeconds(
          seconds
        )}`;
      };
      cartCount = await productHelper.getCartCount(req.session.user._id);
      wishCount = await productHelper.getWishCount(req.session.user._id);
      productHelper
        .getOrderDetails(OrderId)
        .then((response) => {
          let products = response.productDetails;
          let address = response.address;
          let orderDetails = response.orderDetails;
          let multipliedTotal = [];
          for (let i = 0; i < products.length; i++) {
            multipliedTotal.push(products[i].quantity * products[i].price);
          }

          res.render("user/orderDetails", {
            products,
            cartCount,
            wishCount,
            address,
            orderDetails,
            multipliedTotal,
            getDate,
            loggedInStatus: true,
            username,
          });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  cancelOrder: (req, res) => {
    try {
      productHelper
        .cancelOrder(req.params.id)
        .then((response) => {
          res.json(response);
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  returnOrder: (req, res) => {
    try {
      productHelper
        .returnOrder(req.params.id)
        .then((response) => {
          res.json(response);
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  addWishList: (req, res) => {
    try {
      productHelper
        .addWishList(req.params.id, req.session.user._id)
        .then((response) => {
          res.json(response);
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  getWishlist: async (req, res) => {
    try {
      username = req.session.user.name;
      cartCount = await productHelper.getCartCount(req.session.user._id);
      wishCount = await productHelper.getWishCount(req.session.user._id);
      productHelper
        .getWishlist(req.session.user._id)
        .then((wishlist) => {
          res.render("user/wishlist", {
            wishlist,
            cartCount,
            wishCount,
            loggedInStatus: true,
            username,
          });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  removeWishlist: (req, res) => {
    try {
      productHelper
        .removeWishlist(req.body, req.session.user._id)
        .then((response) => {
          res.json(response);
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  validateCoupon: async (req, res) => {
    try {
      couponCode = req.query.couponName;
      let totalAmount = await productHelper.totalAmount(req.session.user._id);
      totalAmount = totalAmount[0].totalAmount;
      productHelper
        .validateCoupon(couponCode, totalAmount, req.session.user._id)
        .then((response) => {
          discountAmount = response.discountAmount;
          couponTotal = response.couponTotal;

          res.json(response);
        });
    } catch (err) {
      res.status(500).send(err);
    }
  },

  postCart: async (req, res) => {
    try {
      let couponData = req.body;
      couponName = req.body.couponName;
      couponTotal = req.body.total;
      discountAmount = req.body.discountAmount;

      if (couponData.couponName) {
        await productHelper
          .addCouponIntoUserDb(couponData, req.session.user._id)
          .then(() => {
            res.redirect("/checkout");
          })
          .catch(() => {
            res.render("error");
          });
      } else {
        res.redirect("/checkout");
      }
    } catch {
      res.render("error");
    }
  },

  postSearch: async (req, res) => {
    if (req.session.user) {
      try {
        cartCount = await productHelper.getCartCount(req.session.user._id);
        wishCount = await productHelper.getWishCount(req.session.user._id);
        username = req.session.user.name;
        let categories = await productHelper.getAllCategory();
        productHelper
          .postSearch(req.body)
          .then((products) => {
            res.render("user/shop-new", {
              products,
              cartCount,
              categories,
              username,
              wishCount,
              DocumentCount: 9,
              pagination: 1,
              page: 1,
            });
          })
          .catch((err) => {
            res.render("error");
          });
      } catch {
        res.render("error");
      }
    } else {
      try {
        let categories = await productHelper.getAllCategory();
        productHelper
          .postSearch(req.body)
          .then((products) => {
            res.render("user/shop-new", {
              products,
              cartCount,
              categories,
              username,
              wishCount,
              DocumentCount: 9,
              pagination: 1,
              page: 1,
            });
          })
          .catch((err) => {
            res.render("error");
          });
      } catch {
        res.render("error");
      }
    }
  },
};
