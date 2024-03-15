const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.js");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());

// Establish connection to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(
  () => {
    console.log(`Connection to mongodb established`);
  },
  (err) => {
    console.log(`Failed to connect to mongodb`, err);
  }
);

// Import routes
const user = require("./routes/user.route");
const userProduct = require("./routes/user.products.routes");

// Use routes
app.use("/api/users", user);
app.use("/api/user-products", userProduct);

// Setup Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Sample GET endpoint
app.get("/user", (req, res) => {
  // Implementation for your /user endpoint
});

// Start the server
app.listen(port, () => {
  console.log(`The server is listening on port ${port}`);
});