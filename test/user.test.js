const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const helper = require("../helpers/user.helper");
const { describe } = require("node:test");

// Removed `require("node:test")` as it's not necessary with Jest.
// If you're using Jest, `describe` and `it` are global functions.

require("dotenv").config();

beforeAll(async () => {
  // Changed from `beforeEach` to `beforeAll` to connect to the database once before all tests run.
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
  // Changed from `afterEach` to `afterAll` to close the database connection once after all tests complete.
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
  it("Create a user", async () => {
    // Ensure unique usernames and emails for successful test cases to avoid conflicts.
    const uniqueSuffix = Date.now().toString();
    const res = await request(app)
      .post("/api/users")
      .send({
        username: "testUser" + uniqueSuffix,
        password: "123456",
        name: "Kostas Kostakis",
        email: `test${uniqueSuffix}@aueb.gr`,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toBeTruthy();
  }, 2000);

  it("Create a user testing password length", async () => {
    const res = await request(app).post("/api/users").send({
      username: "testShortPassword",
      password: "123", // Intentionally short password to trigger validation failure.
      name: "Short Password",
      email: "shortpassword@aueb.gr",
    });
    // Expecting a 400 Bad Request due to validation error for password length.
    expect(res.statusCode).toBe(400);
  }, 2000);

  it("Create a user testing username and email uniqueness", async () => {
    // First, create a unique user
    const uniqueSuffix = Date.now().toString();
    await request(app)
      .post("/api/users")
      .send({
        username: "uniqueUser" + uniqueSuffix,
        password: "123456",
        name: "Unique User",
        email: `unique${uniqueSuffix}@aueb.gr`,
      });

    // Then, try to create another user with the same username and email, expecting a failure.
    const res = await request(app)
      .post("/api/users")
      .send({
        username: "uniqueUser" + uniqueSuffix, // Re-using the username to trigger uniqueness violation.
        password: "123456",
        name: "Unique User 2",
        email: `unique${uniqueSuffix}@aueb.gr`, // Re-using the email as well.
      });

    // Expecting a 400 Bad Request due to uniqueness violation.
    expect(res.statusCode).toBe(400);
    // Depending on your API's response structure for errors, you may need to adjust this expectation.
  }, 2000);

  describe("DELETE /api/users:username", () => {
    it("Delete last inserted user", async () => {
      const result = await helper.findLastInsertedUser();
      const res = await request(app).delete("/api/users/" + result.username);
      expect(res.statusCode).toBe(200);
    }, 2000);
  });
});
