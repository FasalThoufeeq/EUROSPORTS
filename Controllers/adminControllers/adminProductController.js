const cloudinary = require("../../utils/clodinary");
const productHelper = require("../../Helpers/adminHelpers/adminProductHelper");
const slugify = require("slugify");
const path = require("path");
const { response } = require("../../app");
const { totalAmount } = require("../../Helpers/userHelpers/userProduct");
const adminProductHelper = require("../../Helpers/adminHelpers/adminProductHelper");
const { Db } = require("mongodb");

module.exports = {
  //view product
  viewProduct: (req, res) => {
    try {
      productHelper
        .getViewProduct()
        .then((products) => {
          res.render("admin/view-product", {
            layout: "admin-layout",
            products,
          });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  //get add product
  addproduct: (req, res) => {
    try {
      productHelper
        .getAddProduct()
        .then((categorys) => {
          res.render("admin/add-product", {
            layout: "admin-layout",
            categorys,
          });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  postAddProduct: (req, res) => {
    try {
      req.body.slug = slugify(req.body.productname);
      productHelper
        .addProducts(req.body)
        .then(async (product_id) => {
          const imgUrls = [];
          for (let i = 0; i < req.files.length; i++) {
            let result = await cloudinary.uploader.upload(req.files[i].path);
            imgUrls.push(result.url);
          }
          if (imgUrls.length !== 0) {
            productHelper.addProductImage(product_id, imgUrls);
          }
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    } finally {
      res.redirect("/admin/add-products");
    }
  },

  getAddCategory: (req, res) => {
    try {
      productHelper
        .getAddCategory()
        .then((category) => {
          res.render("admin/add-category", {
            layout: "admin-layout",
            category,
          });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  postCategory: (req, res) => {
    try {
      productHelper
        .postAddCategory(req.body)
        .then(() => {
          res.redirect("/admin/add-category");
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  getEditCategory: (req, res) => {
    try {
      productHelper
        .editCatergory(req.params.id)
        .then((category) => {
          res.render("admin/edit-category", {
            layout: "admin-layout",
            category,
          });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  postEditcategory: (req, res) => {
    try {
      productHelper
        .postEditCategory(req.body.editcategoryname, req.params.id)
        .then(() => {
          res.redirect("/admin/add-category");
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  deleteCategory: (req, res) => {
    try {
      productHelper
        .deleteCategory(req.params.id)
        .then(() => {
          res.redirect("/admin/add-category");
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  getEditProduct: (req, res) => {
    try {
      productHelper
        .getAddCategory()
        .then((categorys) => {
          productHelper
            .getEditProduct(req.params.id)
            .then((product) => {
              res.render("admin/edit-product", {
                layout: "admin-layout",
                product,
                categorys,
              });
            })
            .catch(() => {
              res.render("error");
            });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  //post edited product
  postEditProduct: (req, res) => {
    try {
      req.body.slug = slugify(req.body.productname);
      productHelper
        .postEditProduct(req.params.id, req.body)
        .then(async () => {
          const imgUrls = [];
          for (let i = 0; i < req.files.length; i++) {
            let result = await cloudinary.uploader.upload(req.files[i].path);

            imgUrls.push(result.url);
          }
          if (imgUrls.length !== 0) {
            productHelper.addProductImage(req.params.id, imgUrls);
          }
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    } finally {
      res.redirect("/admin/view-products");
    }
  },

  //list
  listProduct: (req, res) => {
    try {
      productHelper.listProduct(req.params.id);
      res.redirect("/admin/view-products");
    } catch {
      res.render("error");
    }
  },

  //unlist
  unlistProduct: (req, res) => {
    try {
      productHelper.unlistProduct(req.params.id);
      res.redirect("/admin/view-products");
    } catch {
      res.render("error");
    }
  },

  //list orders
  getOrdersList: async (req, res) => {
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
      let page = req.query.page;
      let perPage = 8;
      let DocumentCount = await productHelper.getOrderDetailsCount();
      let pagination = Math.ceil(DocumentCount / perPage);
      productHelper
        .getOrdersList(page)
        .then((orders) => {
          res.render("admin/order-listing", {
            layout: "admin-layout",
            orders,
            getDate,
            DocumentCount,
            page,
            pagination,
          });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  getOrderDetails: (req, res) => {
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
      productHelper
        .getOrderDetails(req.params.id)
        .then((order) => {
          let product = order[0].orders.productDetails;
          let total = order[0].orders.totalAmount;
          res.render("admin/order-details", {
            layout: "admin-layout",
            order,
            getDate,
            total,
            product,
          });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  postOrderDetails: (req, res) => {
    try {
      productHelper
        .postOrderDetails(req.body, req.params.id)
        .then(() => {
          res.redirect("/admin//orders-list");
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  addBanner: (req, res) => {
    try {
      productHelper
        .getAllBanner()
        .then((banners) => {
          res.render("admin/add-banner", { layout: "admin-layout", banners });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  postBannner: (req, res) => {
    try {
      productHelper
        .postBannner(req.body)
        .then(async (bannerId) => {
          const imageUrl = [];
          for (let i = 0; i < req.files.length; i++) {
            let result = await cloudinary.uploader.upload(req.files[i].path);
            imageUrl.push(result.url);
          }

          if (imageUrl.length != 0) {
            productHelper.addBannerImg(imageUrl, bannerId);
          }
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    } finally {
      res.redirect("/admin/add-banner");
    }
  },

  editBanner: (req, res) => {
    try {
      productHelper
        .editBanner(req.body, req.params.id)
        .then(async () => {
          res.redirect("/admin/add-banner");
          const imageUrl = [];
          for (let i = 0; i < req.files.length; i++) {
            let result = await cloudinary.uploader.upload(req.files[i].path);
            imageUrl.push(result.url);
          }

          if (imageUrl.length != 0) {
            await productHelper.addBannerImg(imageUrl, req.params.id);
          }
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  viewCoupon: async (req, res) => {
    try {
      const getDate = (date) => {
        let orderDate = new Date(date);
        let day = orderDate.getDate();
        let month = orderDate.getMonth() + 1;
        let year = orderDate.getFullYear();
        return `${isNaN(day) ? "00" : day}-${isNaN(month) ? "00" : month}-${
          isNaN(year) ? "0000" : year
        }`;
      };

      await productHelper
        .getAllCoupon()
        .then((coupons) => {
          res.render("admin/view-coupon", {
            layout: "admin-layout",
            coupons,
            getDate,
          });
        })
        .catch(() => {
          res.render("error");
        });
    } catch {
      res.render("error");
    }
  },

  generateCoupon: (req, res) => {
    try {
      productHelper
        .generateCoupon()
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

  addCoupon: (req, res) => {
    try {
      let data = {
        couponName: req.body.couponName,
        expiry: req.body.expiry,
        minPurchase: Number(req.body.minPurchase),
        description: req.body.description,
        discountPercentage: Number(req.body.discountPercentage),
        maxDiscountValue: Number(req.body.maxDiscountValue),
      };

      productHelper
        .addCoupon(data)
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

  deleteCoupon: (req, res) => {
    try {
      productHelper
        .deleteCoupon(req.params.id)
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

  salesReport: async (req, res) => {
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
      let report = await productHelper.getReport();
      let Details = [];
      let userIds = [];
      report.forEach((order) => {
        Details.push(order.orders);
      });
      report.forEach((order) => {
        userIds.push(order.user);
      });
      res.render("admin/sales-report", {
        layout: "admin-layout",
        Details,
        getDate,
        userIds,
      });
    } catch {
      res.render("error");
    }
  },

  postSalesPeriod: async (req, res) => {
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
      let report = await productHelper.postSalesPeriod(req.body);

      let Details = [];
      let userIds = [];
      report.forEach((order) => {
        Details.push(order.orders);
      });
      report.forEach((order) => {
        userIds.push(order.user);
      });
      console.log(Details);

      res.render("admin/sales-report", {
        layout: "admin-layout",
        Details,
        getDate,
        userIds,
      });
    } catch {
      res.render("error");
    }
  },
};
