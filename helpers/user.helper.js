const User = require("../models/user.model");

/**
 * Finds and returns the most recently inserted user in the database.
 *
 * This function queries the database for users, sorts them in descending order by their
 * creation date (assuming _id is used as a creation timestamp, which is a common MongoDB practice),
 * and returns the first user from the result set. If an error occurs during the query,
 * the function logs the error and returns false.
 *
 * @returns {Promise<Object|boolean>} A promise that resolves to the last inserted user object
 * if successful, or false if an error occurs.
 */
async function findLastInsertedUser() {
  console.log("Find last inserted user");
  try {
    // Query the database for all users, sort them by _id in descending order to get the last inserted user
    const result = await User.find({}).sort({ _id: -1 }).limit(1);
    // Return the last inserted user
    return result[0];
  } catch (err) {
    // Log any errors encountered during the query
    console.log("Problem in finding user", err);
    // Return false in case of an error
    return false;
  }
}

module.exports = { findLastInsertedUser };
