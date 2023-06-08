const { orderModel } = require("../model/orderModel");
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
    if (Object.keys(req.body).length > 0) {
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
        newOrder.orderId = orderList.length[0].orderId + 1;
      } else {
        newOrder.orderId = 1;
      }
    } else {
      res = { data: { msg: `Invalid Payload` }, status: 400 };
    }
  } catch (e) {
    console.error(e);
    return (res = { data: e.message, status: 500 });
  }
};
