const db = require("mongoose");

const sampleSchema = db.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subcategory: [],
  specifications: [
    {
      key: String,
      value: String,
    },
  ],
  inventory: { type: Number, required: true },
});

const sampleModel = db.model("testcollection", sampleSchema);

module.exports = sampleModel;
