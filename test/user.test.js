const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const helper = require("../helpers/user.helper");

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

describe("Get request /api/users", () => {
  it("Returns all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  }, 20000);
});

describe("Request Get /api/users/:username", () => {
  it("Returns a user", async () => {
    const result = await helper.findLastInsertedUser();
    const res = await request(app).get(`/api/users/${result.username}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data.username).toBe(result.username);
    expect(res.body.data.email).toBe(result.email);
  }, 20000);
});

describe("Request POST /api/users", () => {
  it("Create a user with valid credentials", async () => {
    const uniqueSuffix = Date.now().toString();
    const res = await request(app)
      .post("/api/users")
      .send({
        username: "testUser" + uniqueSuffix,
        password: "12345678",
        name: "Kostas",
        surname: "Kostakis",
        email: `test${uniqueSuffix}@aueb.gr`,
        address: "123 Main St",
        phone: "1234567890",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeTruthy();
  }, 2000);

  it("Rejects creation of a user with a short password", async () => {
    const res = await request(app).post("/api/users").send({
      username: "testShortPassword",
      password: "123", // Intentionally short password
      name: "Short Password",
      email: "shortpassword@aueb.gr",
      address: "123 Main St",
      phone: "1234567890",
    });
    expect(res.statusCode).toBe(400);
  }, 2000);

  it("Rejects creation of a user with a long username", async () => {
    const longUsername = "a".repeat(21); // Create a username longer than 20 characters
    const res = await request(app).post("/api/users").send({
      username: longUsername,
      password: "password123",
      name: "Long Username",
      email: "longusername@aueb.gr",
      address: "123 Main St",
      phone: "1234567890",
    });
    expect(res.statusCode).toBe(400);
  }, 2000);
});

// Add more tests for other validation cases if needed

describe("DELETE /api/users/:username", () => {
  it("Delete last inserted user", async () => {
    const result = await helper.findLastInsertedUser();
    const res = await request(app).delete("/api/users/" + result.username);
    expect(res.statusCode).toBe(200);
  }, 2000);
});
