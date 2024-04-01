const Product = require("../models/product.model");

/**
 * Finds and returns the most recently inserted product in the database.
 *
 * This function queries the database for products, sorts them in descending order by their
 * creation date (assuming _id is used as a creation timestamp, which is a common MongoDB practice),
 * and returns the first product from the result set. If an error occurs during the query,
 * the function logs the error and returns false.
 *
 * @returns {Promise<Object|boolean>} A promise that resolves to the last inserted product object
 * if successful, or false if an error occurs.
 */
async function findLastInsertedProduct() {
  console.log("Find last inserted product");
  try {
    const result = await Product.find({}).sort({ _id: -1 }).limit(1);
    return result[0];
  } catch (err) {
    console.log("Problem in finding product", err);
    return false;
  }
}

module.exports = { findLastInsertedProduct };
