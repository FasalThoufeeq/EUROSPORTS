const db = require("../config/connection");
const collection = require("../config/collections");
const { ObjectId } = require("mongodb-legacy");

module.exports = {
  isBlocked: async (req, res, next) => {
    let userId = req.session.user._id;
    let user = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .findOne({ _id: new ObjectId(userId) });
    if (user.blocked == false) {
      next();
    } else {
      res.redirect("/logout");
    }
  },
};
