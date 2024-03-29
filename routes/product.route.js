const express = require("express");
const router = express.Router();

const productsController = require("../controllers/product.controller");

router.get("/", productsController.findAll);
router.get("/:id", productsController.findOne);
router.post("/", productsController.create);
router.patch("/:id", productsController.update);
router.delete("/:id", productsController.delete);

module.exports = router;
