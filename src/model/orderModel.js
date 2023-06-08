const db = require("mongoose");

const orderSchema = db.Schema({
  cusName: { type: String, required: true },
  orderDate: { type: Number, required: true },
  orderInfo: [{}],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  orderId: { type: Number, required: true },
});

const creditSchema = db.Schema({
  cusName: { type: String, required: true },
  orderId: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  discount: { type: Number, required: true },
  paidAmount: { type: Number, required: true },
  balance: { type: Number, required: true },
  orderPk: { type: String, required: true },
});

const paymentSchema = db.Schema({
  cusName: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paymentMethod: [{}],
  orderId: { type: String, required: true },
  orderPk: { type: String, required: true },
});

const orderModel = db.model("orders", orderSchema);
const paymentModel = db.model("payments", paymentSchema);
const creditModel = db.model("credits", creditSchema);

module.exports = { orderModel, creditModel, paymentModel };
