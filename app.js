require("dotenv").config({ path: "./.env" });
const express = require("express");
const { connectDB } = require("./src/config/db");
connectDB();
const app = express();
app.use(express.json());
app.use("/sample", require("./src/controller/sampleController"));

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
