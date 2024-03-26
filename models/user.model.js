const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

let addressSchema = new Schema(
  {
    area: { type: String },
    road: { type: String },
  },
  { _id: false }
);

let productSchema = new Schema({
  product: { type: String },
  cost: { type: Number }, // Corrected from 'const' to 'cost'
  quantity: { type: Number },
  date: { type: Date, default: Date.now },
});

let phoneSchema = new Schema({
  type: { type: String },
  number: { type: String },
});

let userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required field"],
      maxLength: 20,
      unique: true,
      trim: true, // Trims whitespace
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      maxLength: 20,
      minLength: 6,
    },
    name: { type: String },
    surname: { type: String },
    email: {
      type: String,
      required: [true, "Email is required field"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    address: addressSchema,
    phone: { type: [phoneSchema], default: null },
    products: { type: [productSchema], default: null },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Users", userSchema);
