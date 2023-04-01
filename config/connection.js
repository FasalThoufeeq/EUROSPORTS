const mongoClient = require("mongodb-legacy").MongoClient;
const state = {
  db: null,
};

module.exports.connect = (done) => {
  const url =
    "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.1";
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
