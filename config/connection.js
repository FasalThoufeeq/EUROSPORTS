const mongoClient = require("mongodb-legacy").MongoClient;
const state = {
  db: null,
};

module.exports.connect = (done) => {
  const url =process.env.MONGO_URI
  const dbname = "EUROSPORTS";

  mongoClient.connect(url, (err, data) => {
    if (err) return done(err);
    state.db = data.db(dbname);
    done();
  });
};

module.exports.get = () => {
  return state.db;
};
