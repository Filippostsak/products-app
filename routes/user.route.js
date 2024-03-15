const express = require("express");
const router = express.Router(); //Παίζει το ρόλο του ενδιάμεσου αλλά διαχειρίζεται και κλήσεις

const userController = require("../controllers/user.controller");

router.get("/", userController.findAll);
router.get("/:username", userController.findOne);
router.post("/", userController.create);
router.patch("/:username", userController.update);
router.delete("/:username", userController.delete);

module.exports = router;
