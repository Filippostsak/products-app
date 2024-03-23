const m2s = require("mongoose-to-swagger");
const User = require("./models/user.model");
const Product = require("./models/product.model");

exports.options = {
  components: {
    schemas: {
      User: m2s(User),
      Product: m2s(Product),
    },
  },
  openapi: "3.0.0",
  info: {
    version: "3.0.0",
    title: "Products CRUD API",
    description: "Products project app",
    contact: {
      name: "API support",
      url: "http://www.example.com",
      email: "support@example.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Server",
    },
    {
      url: "http://www.example.com",
      description: "Production Server",
    },
  ],
  tags: [
    {
      name: "Users",
      description: "API endpoints for users",
    },
    {
      name: "Products",
      description: "API endpoints for products",
    },
    {
      name: "Users and Products",
      description: "API endpoints for Users and their products",
    },
  ],
  paths: {
    "/api/users": {
      get: {
        tags: ["Users"],
        description: "Return all users",
        responses: {
          200: {
            description: "A list of users",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/users/{username}": {
      get: {
        tags: ["Users"],
        parameters: [
          {
            name: "username",
            in: "path",
            required: true,
            description: "Username of user that we want to find",
            schema: { type: "string" },
          },
        ],
        description: "Get user with specific username",
        responses: {
          200: {
            description: "User found",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/User",
                },
              },
            },
          },
        },
      },
    },
  },
};
