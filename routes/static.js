const express = require("express");
const router = express.Router();
const baseController = require("../controllers/baseController");

// Home page
router.get("/", baseController.buildHome);

module.exports = router;






