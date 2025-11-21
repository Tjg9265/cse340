const express = require("express");
const router = express.Router();
const baseController = require("../controllers/baseController");

// Serve static files
router.use(express.static("public"));
router.use("/css", express.static("public/css"));
router.use("/js", express.static("public/js"));
router.use("/images", express.static("public/images"));

// Home route
router.get("/", baseController.buildHome);

module.exports = router;





