const cloudinary = require("../../utils/clodinary");
const productHelper = require("../../Helpers/adminHelpers/adminProductHelper");
const path = require("path");
const { response } = require("../../app");
const { totalAmount } = require("../../Helpers/userHelpers/userProduct");
const adminProductHelper = require("../../Helpers/adminHelpers/adminProductHelper");
const { Db } = require("mongodb");

module.exports = {
  //view product
  viewProduct: (req, res) => {
    productHelper.getViewProduct().then((products) => {
      res.render("admin/view-product", { layout: "admin-layout", products });
    });
  },

  //get add product
  addproduct: (req, res) => {
    productHelper.getAddProduct().then((categorys) => {
      res.render("admin/add-product", { layout: "admin-layout", categorys });
    });
  },

  postAddProduct: (req, res) => {
    try {
      productHelper.addProducts(req.body).then(async (product_id) => {
        const imgUrls = [];
        for (let i = 0; i < req.files.length; i++) {
          let result = await cloudinary.uploader.upload(req.files[i].path);
          imgUrls.push(result.url);
        }
        if (imgUrls.length !== 0) {
          productHelper.addProductImage(product_id, imgUrls);
        }
      });
    } catch {
      console.log(err);
    } finally {
      res.redirect("/admin/add-products");
    }
  },

  getAddCategory: (req, res) => {
    productHelper.getAddCategory().then((category) => {
      res.render("admin/add-category", { layout: "admin-layout", category });
    });
  },

  postCategory: (req, res) => {
    productHelper.postAddCategory(req.body).then(() => {
      res.redirect("/admin/add-category");
    });
  },

  getEditCategory: (req, res) => {
    productHelper.editCatergory(req.params.id).then((category) => {
      res.render("admin/edit-category", { layout: "admin-layout", category });
    });
  },

  postEditcategory: (req, res) => {
    productHelper
      .postEditCategory(req.body.editcategoryname, req.params.id)
      .then(() => {
        res.redirect("/admin/add-category");
      });
  },

  deleteCategory: (req, res) => {
    productHelper.deleteCategory(req.params.id).then(() => {
      res.redirect("/admin/add-category");
    });
  },

  getEditProduct: (req, res) => {
    productHelper.getAddCategory().then((categorys) => {
      productHelper.getEditProduct(req.params.id).then((product) => {
        res.render("admin/edit-product", {
          layout: "admin-layout",
          product,
          categorys,
        });
      });
    });
  },

  //post edited product
  postEditProduct: (req, res) => {
    try {
      productHelper.postEditProduct(req.params.id, req.body).then(async () => {
        const imgUrls = [];
        for (let i = 0; i < req.files.length; i++) {
          let result = await cloudinary.uploader.upload(req.files[i].path);

          imgUrls.push(result.url);
        }
        if (imgUrls.length !== 0) {
          productHelper.addProductImage(req.params.id, imgUrls);
        }
      });
    } catch {
      console.log(err);
    } finally {
      res.redirect("/admin/view-products");
    }
  },

  //list
  listProduct: (req, res) => {
    productHelper.listProduct(req.params.id);
    res.redirect("/admin/view-products");
  },

  //unlist
  unlistProduct: (req, res) => {
    productHelper.unlistProduct(req.params.id);
    res.redirect("/admin/view-products");
  },

  //list orders
  getOrdersList: async (req, res) => {
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
    productHelper.getOrdersList(page).then((orders) => {
      res.render("admin/order-listing", {
        layout: "admin-layout",
        orders,
        getDate,
        DocumentCount,
        page,
        pagination,
      });
    });
  },

  getOrderDetails: (req, res) => {
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
    productHelper.getOrderDetails(req.params.id).then((order) => {
      let product = order[0].orders.productDetails;
      let total = order[0].orders.totalAmount;
      res.render("admin/order-details", {
        layout: "admin-layout",
        order,
        getDate,
        total,
        product,
      });
    });
  },

  postOrderDetails: (req, res) => {
    productHelper.postOrderDetails(req.body, req.params.id).then(() => {
      res.redirect("/admin//orders-list");
    });
  },

  addBanner: (req, res) => {
    productHelper.getAllBanner().then((banners) => {
      res.render("admin/add-banner", { layout: "admin-layout", banners });
    });
  },

  postBannner: (req, res) => {
    try {
      productHelper.postBannner(req.body).then(async (bannerId) => {
        const imageUrl = [];
        for (let i = 0; i < req.files.length; i++) {
          let result = await cloudinary.uploader.upload(req.files[i].path);
          imageUrl.push(result.url);
        }

        if (imageUrl.length != 0) {
          productHelper.addBannerImg(imageUrl, bannerId);
        }
      });
    } catch {
      console.log(err);
    } finally {
      res.redirect("/admin/add-banner");
    }
  },

  editBanner: (req, res) => {
    productHelper.editBanner(req.body, req.params.id).then(async () => {
      res.redirect("/admin/add-banner");
      const imageUrl = [];
      for (let i = 0; i < req.files.length; i++) {
        let result = await cloudinary.uploader.upload(req.files[i].path);
        imageUrl.push(result.url);
      }

      if (imageUrl.length != 0) {
        await productHelper.addBannerImg(imageUrl, req.params.id);
      }
    });
  },

  viewCoupon: async (req, res) => {
    const getDate = (date) => {
      let orderDate = new Date(date);
      let day = orderDate.getDate();
      let month = orderDate.getMonth() + 1;
      let year = orderDate.getFullYear();
      return `${isNaN(day) ? "00" : day}-${isNaN(month) ? "00" : month}-${
        isNaN(year) ? "0000" : year
      }`;
    };

    await productHelper.getAllCoupon().then((coupons) => {
      res.render("admin/view-coupon", {
        layout: "admin-layout",
        coupons,
        getDate,
      });
    });
  },

  generateCoupon: (req, res) => {
    productHelper.generateCoupon().then((response) => {
      res.json(response);
    });
  },

  addCoupon: (req, res) => {

    let data = {
      couponName: req.body.couponName,
      expiry: req.body.expiry,
      minPurchase: Number(req.body.minPurchase),
      description: req.body.description,
      discountPercentage: Number(req.body.discountPercentage),
      maxDiscountValue: Number(req.body.maxDiscountValue),
    };

    productHelper.addCoupon(data).then((response) => {
      res.json(response);
    });
  },

  deleteCoupon: (req, res) => {
    productHelper.deleteCoupon(req.params.id).then((response) => {
      res.json(response);
    });
  },

  salesReport: async (req, res) => {
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
  },

  postSalesPeriod: async (req, res) => {
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
    report.forEach((order) => {
      Details.push(order.orders);
    });
    res.render("admin/sales-report", {
      layout: "admin-layout",
      Details,
      getDate,
    });
  },
};
