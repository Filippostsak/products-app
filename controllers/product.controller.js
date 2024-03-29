const Product = require("../models/product.model");
const mongoose = require("mongoose");
const logger = require("../logger/logger");

exports.findAll = async (req, res) => {
  console.log("Find all products");

  try {
    const result = await Product.find({});
    res.status(200).json({ data: result });
    logger.debug("Success in reading all products");
    logger.info("Success in reading all products");
  } catch (err) {
    console.log(`Problem in reading products, ${err}`);
    logger.error(`Problem in reading all products, ${err}`);
    res
      .status(500)
      .json({ message: "Error while fetching products", error: err });
  }
};

exports.findOne = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error retrieving product with id=" + id,
      error: err.message,
    });
  }
};

exports.create = async (req, res) => {
  console.log("Insert a product");

  const newProduct = new Product({
    product: req.body.product,
    cost: req.body.cost,
    description: req.body.description,
    quantity: req.body.quantity,
  });

  try {
    const result = await newProduct.save();
    res.status(201).json({ data: result });
    console.log("Product saved");
  } catch (err) {
    console.log("Problem in saving a product", err);
    res.status(400).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const id = req.params.id;
  console.log("Update product with ID:", id);

  const updateData = {
    product: req.body.product,
    cost: req.body.cost,
    description: req.body.description,
    quantity: req.body.quantity,
  };

  try {
    const result = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ data: result });
    console.log("Success in updating a product:", result);
  } catch (err) {
    console.error("Problem in updating a product:", err);
    res.status(400).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  console.log("Delete a product:", id);

  try {
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ data: result });
    console.log("Success in deleting a product", id);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Problem in deleting a product:", err);
  }
};
