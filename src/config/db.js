const db = require("mongoose");

module.exports.connectDB = () => {
  console.log(process.env.MONGO_URL)
  try {
    db.connect(process.env.MONGO_URL)
      .then(() => {
        console.log("Db connected");
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (e) {
    console.error(e.message);
  }
};
