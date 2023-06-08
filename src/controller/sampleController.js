const sampleController = require("express").Router();
const sampleService = require("../routes/sampleRoutes");
const validate = require("../middleware/validator");

sampleController.get("/getData", async (req, res) => {
  let result = await sampleService.viewItem(req);
  if (validate.checkobject(result)) {
    res.status(result.status).send(result.data);
  } else {
    res.status(502).send({ data: "function failed" });
  }
});

sampleController.post("/addorder", async (req, res) => {
  let result = await sampleService.addOrder(req);
  if (validate.checkobject(result)) {
    res.status(result.status).send(result.data);
  } else {
    res.status(502).send({ data: "function failed" });
  }
});
module.exports = sampleController;
