const sampleController = require("express").Router();
const sampleService = require("../routes/sampleRoutes");

sampleController.get("/getData", async (req, res) => {
  let result = await sampleService.viewItem(req);
  if (Object.keys(result).length > 0) {
    res.status(result.status).send(result.data);
  } else {
    res.status(502).send({ data: "function failed" });
  }
});

module.exports = sampleController;
