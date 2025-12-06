const express = require("express")
const router = new express.Router()
const travelController = require("../controllers/travelController")
const utilities = require("../utilities")

// Travel journal home page
router.get(
  "/",
  utilities.checkLogin,  // protects the page
  utilities.handleErrors(travelController.buildTravelList)
)

// Add entry form
router.get(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors(travelController.buildAddEntry)
)

// Process new entry
router.post(
  "/add",
  utilities.checkLogin,
  utilities.handleErrors(travelController.addEntry)
)

module.exports = router
