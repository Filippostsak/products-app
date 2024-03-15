const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
require("dotenv").config();

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(
  () => {
    console.log(`Connection to mongodb established`);
  },
  (err) => {
    console.log(`Failed to connect to mongodb`, err);
  }
);

const user = require("./routes/user.route");
const userProduct = require("./routes/user.products.routes");

app.use("/api/users", user);
app.use("/api/user-products", userProduct);

app.get("/user", (req, res) => {});

app.listen(port, () => {
  console.log(`the server is listening on port ${port}`);
});
