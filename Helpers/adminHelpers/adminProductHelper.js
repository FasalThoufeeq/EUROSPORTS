const db = require("../../config/connection");
const collection = require("../../config/collections");
const { ObjectId } = require("mongodb-legacy");
const { resolve, reject } = require("promise");
const voucher_codes = require("voucher-code-generator");

module.exports = {
  //get product view
  getViewProduct: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let products = await db
          .get()
          .collection(collection.PRODUCT_COLLECTION)
          .aggregate([
            {
              $lookup: {
                from: "category",
                localField: "category",
                foreignField: "_id",
                as: "catDetails",
              },
            },
          ])
          .toArray();
        resolve(products);
      } catch {
        reject();
      }
    });
  },

  //get add product
  getAddProduct: () => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.CATEGORY_COLLECTION)
          .find()
          .toArray()
          .then((categorys) => {
            resolve(categorys);
          });
      } catch {
        reject();
      }
    });
  },

  //post add product
  addProducts: (products) => {
    return new Promise(async (resolve, reject) => {
      try {
        products.price = Number(products.price);
        products.quantity = Number(products.quantity);
        products.list = true;
        let category = await db
          .get()
          .collection(collection.CATEGORY_COLLECTION)
          .findOne({ categoryname: products.category });
        products.category = category._id;

        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .insertOne(products)
          .then((productDetails) => {
            resolve(productDetails.insertedId);
          });
      } catch {
        reject();
      }
    });
  },

  addProductImage: (productId, imgUrls) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .updateOne(
            { _id: new ObjectId(productId) },
            { $set: { image: imgUrls } }
          );
      } catch {
        reject();
      }
    });
  },

  //get add category
  getAddCategory: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let category = await db
          .get()
          .collection(collection.CATEGORY_COLLECTION)
          .find()
          .toArray();

        resolve(category);
      } catch {
        reject();
      }
    });
  },

  //post category
  postAddCategory: (category) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.CATEGORY_COLLECTION)
          .insertOne(category)
          .then(() => {
            resolve();
          });
      } catch {
        reject();
      }
    });
  },

  editCatergory: (categoryId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await db
          .get()
          .collection(collection.CATEGORY_COLLECTION)
          .findOne({ _id: new ObjectId(categoryId) })
          .then((response) => {
            resolve(response);
          });
      } catch {
        reject();
      }
    });
  },

  //post edited category
  postEditCategory: (categoryname, categoryId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await db
          .get()
          .collection(collection.CATEGORY_COLLECTION)
          .updateOne(
            { _id: new ObjectId(categoryId) },
            { $set: { categoryname: categoryname } }
          )
          .then(() => {
            resolve();
          });
      } catch {
        reject();
      }
    });
  },

  //delete category
  deleteCategory: (categoryId) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.CATEGORY_COLLECTION)
          .deleteOne({ _id: new ObjectId(categoryId) })
          .then(() => {
            resolve();
          });
      } catch {
        reject();
      }
    });
  },

  //get edit ptoduct
  getEditProduct: (productId) => {
    return new Promise((resolve, reject) => {
      try {
        let product = db
          .get()
          .collection(collection.PRODUCT_COLLECTION)
          .findOne({ _id: new ObjectId(productId) });
        resolve(product);
      } catch {
        reject();
      }
    });
  },

  //post edit product
  postEditProduct: (productId, editedDetails) => {
    return new Promise((resolve, reject) => {
      try {
        editedDetails.price = Number(editedDetails.price);
        editedDetails.quantity = Number(editedDetails.quantity);
        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .updateOne(
            { _id: new ObjectId(productId) },
            {
              $set: {
                productname: editedDetails.productname,
                description: editedDetails.description,
                price: editedDetails.price,
                quantity: editedDetails.quantity,
                category: new ObjectId(editedDetails.category),
                slug:editedDetails.slug
              },
            }
          )
          .then(() => {
            resolve();
          });
      } catch {
        reject();
      }
    });
  },

  //list
  listProduct: (productId) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .updateOne({ _id: new ObjectId(productId) }, { $set: { list: true } })
          .then(() => {
            resolve();
          });
      } catch {
        reject();
      }
    });
  },
  //unlist
  unlistProduct: (productId) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .updateOne(
            { _id: new ObjectId(productId) },
            { $set: { list: false } }
          )
          .then(() => {
            resolve();
          });
      } catch {
        reject();
      }
    });
  },

  getOrderDetailsCount: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let count = await db
          .get()
          .collection(collection.ORDER_COLLECTION)
          .find()
          .toArray();
        let length = count.length;
        let total = 0;
        for (let i = 0; i < length; i++) {
          total += count[i].orders.length;
        }
        resolve(total);
      } catch {
        reject();
      }
    });
  },

  getOrdersList: (page) => {
    return new Promise(async (resolve, reject) => {
      try {
        let pageNumber;
        if (page) {
          pageNumber = page;
        } else {
          pageNumber = 1;
        }
        let perPageCount = 8;

        let orders = await db
          .get()
          .collection(collection.ORDER_COLLECTION)
          .aggregate([
            { $unwind: "$orders" },

            { $sort: { "orders.orderedDate": -1 } },

            { $skip: (pageNumber - 1) * perPageCount },

            { $limit: perPageCount },
          ])
          .toArray();

        resolve(orders);
      } catch {
        reject();
      }
    });
  },

  getOrderDetails: (OrderId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let order = await db
          .get()
          .collection(collection.ORDER_COLLECTION)
          .aggregate([
            { $match: { "orders._id": new ObjectId(OrderId) } },

            { $unwind: "$orders" },

            { $match: { "orders._id": new ObjectId(OrderId) } },
          ])
          .toArray();

        resolve(order);
      } catch {
        reject();
      }
    });
  },

  postOrderDetails: (body, OrderId) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.ORDER_COLLECTION)
          .updateOne(
            { "orders._id": new ObjectId(OrderId) },
            { $set: { "orders.$.orderStatus": body.status } }
          )
          .then(() => {
            resolve();
          });
      } catch {
        reject();
      }
    });
  },

  postBannner: (texts) => {
    return new Promise((resolve, reject) => {
      try {
        let bannerObj = {
          title: texts.title,
          description: texts.description,
          link: texts.link,
        };
        db.get()
          .collection(collection.BANNER_COLLECTION)
          .insertOne(bannerObj)
          .then((bannerDrtails) => {
            resolve(bannerDrtails.insertedId);
          });
      } catch {
        reject();
      }
    });
  },

  addBannerImg: (imageUrl, bannerId) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.BANNER_COLLECTION)
          .updateOne(
            { _id: new ObjectId(bannerId) },
            { $set: { image: imageUrl } }
          );
      } catch {
        reject();
      }
    });
  },

  getAllBanner: () => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.BANNER_COLLECTION)
          .find()
          .toArray()
          .then((banners) => {
            resolve(banners);
          });
      } catch {
        reject();
      }
    });
  },

  editBanner: (texts, bannerId) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.BANNER_COLLECTION)
          .updateOne(
            { _id: new ObjectId(bannerId) },
            {
              $set: {
                title: texts.title,
                description: texts.description,
                link: texts.link,
              },
            }
          )
          .then(() => {
            resolve();
          });
      } catch {
        reject();
      }
    });
  },

  productsCount: () => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.PRODUCT_COLLECTION)
          .find()
          .toArray()
          .then((products) => {
            resolve(products);
          });
      } catch {
        reject();
      }
    });
  },

  orderByCOD: () => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.ORDER_COLLECTION)
          .aggregate([
            { $unwind: "$orders" },

            { $match: { "orders.paymentMethod": "COD" } },
          ])
          .toArray()
          .then((orderByCOD) => {
            resolve(orderByCOD);
          });
      } catch {
        reject();
      }
    });
  },

  orderByRazorpay: () => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.ORDER_COLLECTION)
          .aggregate([
            { $unwind: "$orders" },

            { $match: { "orders.paymentMethod": "Razorpay" } },
          ])
          .toArray()
          .then((orderByRazorpay) => {
            resolve(orderByRazorpay);
          });
      } catch {
        reject();
      }
    });
  },

  getOrderByDate: () => {
    return new Promise((resolve, reject) => {
      try {
        const startDate = new Date("2022-01-01");
        db.get()
          .collection(collection.ORDER_COLLECTION)
          .find({ "orders.orderedDate": { $gte: startDate } })
          .toArray()
          .then((orderDate) => {
            resolve(orderDate);
          });
      } catch {
        reject();
      }
    });
  },

  getAllOrders: () => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.ORDER_COLLECTION)
          .aggregate([
            { $unwind: "$orders" },

            {
              $match: {
                $or: [
                  { "orders.orderStatus": "Success" },
                  { "orders.orderStatus": "Delivered" },
                ],
              },
            },
          ])
          .toArray()
          .then((response) => {
            resolve(response);
          });
      } catch {
        reject();
      }
    });
  },

  categorys: () => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.CATEGORY_COLLECTION)
          .find()
          .toArray()
          .then((categorys) => {
            resolve(categorys);
          });
      } catch {
        reject();
      }
    });
  },

  generateCoupon: () => {
    return new Promise((resolve, reject) => {
      try {
        let couponCode = voucher_codes.generate({
          length: 6,
          count: 1,
          charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          prefix: "WHITE-",
        });
        resolve({ status: true, couponCode: couponCode[0] });
      } catch (err) {
        reject(err);
      }
    });
  },

  addCoupon: (data) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.COUPON_COLLECTION)
          .insertOne(data)
          .then(() => {
            resolve({ status: true });
          });
      } catch {
        reject();
      }
    });
  },

  getAllCoupon: () => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.COUPON_COLLECTION)
          .find()
          .toArray()
          .then((coupons) => {
            resolve(coupons);
          });
      } catch {
        reject();
      }
    });
  },

  deleteCoupon: (couponId) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.COUPON_COLLECTION)
          .deleteOne({ _id: new ObjectId(couponId) })
          .then((response) => {
            resolve(response);
          });
      } catch {
        reject();
      }
    });
  },

  getReport: () => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.ORDER_COLLECTION)
          .aggregate([
            { $unwind: "$orders" },

            {
              $match: {
                $or: [
                  { "orders.orderStatus": "Delivered" },
                  { "orders.orderStatus": "Success" },
                ],
              },
            },
          ])
          .toArray()
          .then((report) => {
            resolve(report);
          });
      } catch {
        reject();
      }
    });
  },

  postSalesPeriod: (body) => {
    return new Promise((resolve, reject) => { 
      try{
      let start = new Date(body.startdate);
      let end = new Date(body.enddate);
      db.get()
        .collection(collection.ORDER_COLLECTION)
        .aggregate([
          { $unwind: "$orders" },

          {
            $match: {
              $or: [
                { "orders.orderStatus": "Delivered" },
                { "orders.orderStatus": "Success" },
              ],
              "orders.orderedDate": { $gte: start, $lte: end },
            },
          },
        ])
        .toArray()
        .then((report) => {
          resolve(report);
        });
      }
      catch{
        reject();
      }
    });
  },
};
