const db = require("../../config/connection");
const collection = require("../../config/collections");
const { response } = require("../../app");
const { ObjectId } = require("mongodb-legacy");

module.exports = {
  //get users liist
  getUsersList: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const users = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .find()
          .toArray();
        resolve(users);
      } catch {
        reject();
      }
    });
  },

  //block user
  blockUser: (id) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.USER_COLLECTION)
          .updateOne(
            { _id: new ObjectId(id) },

            { $set: { blocked: true } }
          )

          .then((response) => {
            resolve(response);
          });
      } catch {
        reject();
      }
    });
  },

  UnBlockUser: (id) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.USER_COLLECTION)
          .updateOne({ _id: new ObjectId(id) }, { $set: { blocked: false } })
          .then((response) => {
            resolve(response);
          });
      } catch {
        reject();
      }
    });
  },
};
