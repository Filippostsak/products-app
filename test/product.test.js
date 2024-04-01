const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const { findLastInsertedProduct } = require("../helpers/product.helper");
const { describe } = require("node:test");

require("dotenv").config();

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/products", () => {
  it("should return all products", async () => {
    const res = await request(app).get("/api/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  }, 20000);
});

describe("GET /api/products/:id", () => {
  it("returns a product by id", async () => {
    const product = await findLastInsertedProduct();
    if (!product) {
      throw new Error("No product found");
    }
    const res = await request(app).get(`/api/products/${product.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(product._id.toString());
  }, 20000);
});

describe("POST /api/products", () => {
  it("creates a new product", async () => {
    const res = await request(app).post("/api/products").send({
      product: "New Product",
      cost: 10,
      description: "A new test product",
      quantity: 5,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("_id");
  }, 2000);
});

describe("PUT /api/products/:id", () => {
  it("updates a product", async () => {
    const product = await findLastInsertedProduct();
    if (!product) {
      throw new Error("No product found for update test.");
    }
    const res = await request(app).put(`/api/products/${product._id}`).send({
      product: "Updated Product",
      cost: 15,
      description: "An updated test product",
      quantity: 10,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.product).toBe("Updated Product");
  }, 2000);
});

describe("DELETE /api/products/:id", () => {
  it("deletes a product", async () => {
    const product = await findLastInsertedProduct();
    if (!product) {
      throw new Error("No product found for delete test.");
    }
    const res = await request(app).delete(`/api/products/${product._id}`);
    expect(res.statusCode).toBe(200);
  }, 2000);
});
