const express = require("express")
const router = new express.Router()

const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Validators
const classValidate = require("../utilities/classification-validation")
const invValidate = require("../utilities/inventory-validation")

/* ============================
   Classification Views
============================ */

// Classification view
router.get(
  "/type/:classification_id",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Vehicle detail
router.get(
  "/detail/:invId",
  utilities.handleErrors(invController.buildByInventoryId)
)

/* ============================
   Management View
============================ */

router.get(
  "/",
  utilities.handleErrors(invController.buildManagement)
)

/* ============================
   Add Classification
============================ */

// Show form
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Process form
router.post(
  "/add-classification",
  classValidate.classRules(),       // ✔ MATCHES FILE
  classValidate.checkClassData,     // ✔ MATCHES FILE
  utilities.handleErrors(invController.addClassification)
)

/* ============================
   Add Inventory
============================ */

// Show form
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Process form
router.post(
  "/add-inventory",
  invValidate.invRules(),          // ✔ MATCHES FILE
  invValidate.checkInvData,        // ✔ MATCHES FILE
  utilities.handleErrors(invController.addInventory)
)

module.exports = router
