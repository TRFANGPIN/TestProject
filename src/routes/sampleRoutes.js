const { checkobject, validateQuantity } = require("../middleware/validator");
const {
  orderModel,
  creditModel,
  paymentModel,
} = require("../model/orderModel");
const sampleModel = require("../model/sampleModel");

module.exports.viewItem = async (req) => {
  try {
    // let dataList = await sampleModel.find({ inventory: { $gt: 0 } });
    let dataList = {};
    dataList = await sampleModel.find(
      {
        category: req.query.category,
        inventory: { $gt: 0 },
        subcategory: { $in: [req.query.subcategory] },
        createdAt: req.query.date,
      },
      { name: 1, price: 1, specifications: 1 }
    );

    if (Array.isArray(dataList) && dataList.length > 0) {
      res = { data: dataList, status: 200 };
    } else {
      res = { data: { msg: `NO Data To Retrieve` }, status: 404 };
    }
    return res;
  } catch (e) {
    console.error(e.message);
    return (res = { data: e.message, status: 500 });
  }
};

module.exports.addOrder = async (req) => {
  try {
    if (checkobject(req.body)) {
      if (!Array.isArray(req.body.orderInfo)) {
        return (res = {
          data: { msg: `Invalid Paylod with order info` },
          status: 400,
        });
      } else {
        for (let i = 0; i < req.body.orderInfo.length; i++) {
          const element = req.body.orderInfo[i];
          if (typeof element.quantity != "number") {
            return (res = {
              data: { msg: `Order Payload Failure @ ${i} th item` },
              status: 400,
            });
          }
        }
      }

      let newOrder = new orderModel({
        cusName: req.body.cusName,
        orderDate: new Date(req.body.orderDate).getTime(),
        orderInfo: req.body.orderInfo,
        totalAmount: req.body.totalAmount,
        discount: req.body.discount,
        paidAmount: req.body.paidAmount,
      });
      let orderList = await orderModel.aggregate([{ $sort: { orderId: -1 } }]);
      if (orderList.length > 0) {
        newOrder.orderId = orderList[0].orderId + 1;
      } else {
        newOrder.orderId = 1;
      }
      let paidAmount = 0;
      if (Array.isArray(req.body.paymentMethod)) {
        req.body.paymentMethod.map((x) => {
          paidAmount = paidAmount + x.paidAmount;
        });
      }

      let saveOrder = await newOrder.save();
      if (checkobject(saveOrder)) {
        saveOrder.orderInfo.map(async (x) => {
          let itemexist = await sampleModel.findOne({ _id: x.itemInfo });
          if (checkobject(itemexist)) {
            itemexist.inventory = itemexist.inventory - x.quantity;
            await sampleModel.findOneAndUpdate(
              { _id: x.itemInfo },
              { $set: itemexist },
              { new: true }
            );
          } else {
            await orderModel.deleteOne({ _id: saveOrder._id });
            return (res = { data: { msg: `no item exist` }, status: 404 });
          }
        });
        if (newOrder.totalAmount - newOrder.discount > paidAmount) {
          let newCredit = new creditModel({
            cusName: newOrder.cusName,
            orderId: "ORD" + newOrder.orderId,
            totalAmount: newOrder.totalAmount,
            discount: newOrder.discount,
            paidAmount: paidAmount,
            orderPk: saveOrder._id,
          });
          newCredit.balance =
            newOrder.totalAmount - newOrder.discount - paidAmount;
          let savecredit = await newCredit.save();
          if (!checkobject(savecredit)) {
            await orderModel.deleteOne({ _id: saveOrder._id });
            return (res = { data: { msg: `credit save failed` }, status: 422 });
          }
        }
        if (paidAmount > 0) {
          let newpayment = new paymentModel({
            cusName: newOrder.cusName,
            totalAmount: newOrder.totalAmount,
            paymentMethod: req.body.paymentMethod,
            orderId: "ORD" + newOrder.orderId,
            orderPk: newOrder._id,
          });
          let savepayment = await newpayment.save();
          if (!checkobject(savepayment)) {
            await orderModel.deleteOne({ _id: saveOrder._id });
            await creditModel.deleteOne({ orderPk: saveOrder._id });
            return (res = { data: { msg: `credit save failed` }, status: 422 });
          }
        }
        return (res = {
          data: { msg: `order saved with id ${saveOrder.orderId}` },
          status: 200,
        });
      } else {
        return (res = { data: { msg: `Save to db failed` }, status: 422 });
      }
    } else {
      return (res = { data: { msg: `Invalid Payload` }, status: 400 });
    }
  } catch (e) {
    console.error(e);
    return (res = { data: e.message, status: 500 });
  }
};
