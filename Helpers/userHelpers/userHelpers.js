const db = require("../../config/connection");
const collection = require("../../config/collections");
const bcrypt = require("bcrypt");
const { response } = require("../../app");
const { ObjectId } = require("mongodb-legacy");

module.exports = {
  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        userData.blocked = Boolean(userData.blocked);
        userData.phone = Number(userData.phone);

        let emailExist = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .findOne({ email: userData.email });
        let phoneExist = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .findOne({ phone: userData.phone });

        if (emailExist || phoneExist) {
          resolve({ status: false });
        } else {
          userData.password = await bcrypt.hash(userData.password, 10);
          db.get()
            .collection(collection.USER_COLLECTION)
            .insertOne(userData)
            .then((response) => {
              resolve({ response, status: true });
            });
        }
      } catch {
        reject();
      }
    });
  },

  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .findOne({ email: userData.email });
        if (user) {
          if (user.blocked == false) {
            bcrypt.compare(userData.password, user.password).then((status) => {
              if (status) {
                let username = user.name;
                resolve({ loggedInStatus: true, username, user });
              } else {
                resolve({ loggedInStatus: false });
              }
            });
          } else {
            resolve({ blockedStatus: true });
          }
        } else {
          resolve({ loggedInStatus: false });
        }
      } catch {
        reject();
      }
    });
  },

  numberExist: (number) => {
    return new Promise(async (resolve, reject) => {
      try {
        number = Number(number);
        let user = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .findOne({ phone: number });
        resolve(user);
      } catch {
        reject();
      }
    });
  },

  changePass: (changedDetails) => {
    return new Promise(async (resolve, reject) => {
      try {
        let emailExist = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .findOne({ email: changedDetails.email });
        if (emailExist) {
          let newPassword = await bcrypt.hash(changedDetails.password, 10);
          db.get()
            .collection(collection.USER_COLLECTION)
            .updateOne(
              { email: changedDetails.email },
              { $set: { password: newPassword } }
            );
          resolve({ changed: true });
        } else {
          resolve({ changed: false });
        }
      } catch {
        reject();
      }
    });
  },

  getProfile: (userId) => {
    return new Promise((resolve, reject) => {
      try {
        db.get()
          .collection(collection.USER_COLLECTION)
          .findOne({ _id: new ObjectId(userId) })
          .then((userData) => {
            resolve(userData);
          });
      } catch {
        reject();
      }
    });
  },

  updateProfile: (body, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const phone = Number(body.phone);

        await db
          .get()
          .collection(collection.USER_COLLECTION)
          .updateOne(
            { _id: new ObjectId(userId) },
            { $set: { name: body.fname, email: body.email, phone: phone } }
          )
          .then((response) => {
            resolve(response);
          });
      } catch {
        reject();
      }
    });
  },

  resetPassword: (body, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await db
          .get()
          .collection(collection.USER_COLLECTION)
          .findOne({ _id: new ObjectId(userId) });

        await bcrypt
          .compare(body.password, user.password)
          .then(async (status) => {
            if (status) {
              let hashedPassword = await bcrypt.hash(body.password2, 10);

              await db
                .get()
                .collection(collection.USER_COLLECTION)
                .updateOne(
                  { _id: new ObjectId(userId) },
                  { $set: { password: hashedPassword } }
                )
                .then((response) => {
                  resolve(response);
                });
            } else {
              resolve(false);
            }
          });
      } catch {
        reject();
      }
    });
  },

  deleteAddress: (body, userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        db.get()
          .collection(collection.ADDRESS_COLLECTION)
          .updateOne(
            { user: new ObjectId(userId) },
            { $pull: { address: { _id: new ObjectId(body.addressId) } } }
          )
          .then(() => {
            resolve({ deleteAddress: true });
          });
      } catch {
        reject();
      }
    });
  },
};
