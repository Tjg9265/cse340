// routes/inventoryRoute.js

const express = require("express")
const router = new express.Router()

const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Validators
const classValidate = require("../utilities/classification-validation")
const invValidate = require("../utilities/inventory-validation")

// Auth middleware
const { checkEmployeeOrAdmin } = require("../utilities/accountAuthorization")

/* ============================
   Public Views (no login)
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
   Management View (protected)
============================ */

router.get(
  "/",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildManagement)
)

/* ============================
   Add Classification (protected)
============================ */

// Show form
router.get(
  "/add-classification",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddClassification)
)

// Process form
router.post(
  "/add-classification",
  checkEmployeeOrAdmin,
  classValidate.classRules(),
  classValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
)

/* ============================
   Add Inventory (protected)
============================ */

// Show form
router.get(
  "/add-inventory",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildAddInventory)
)

// Process form
router.post(
  "/add-inventory",
  checkEmployeeOrAdmin,
  invValidate.invRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
)

/* ============================
   Edit Inventory (protected)
============================ */

// Show edit form
router.get(
  "/edit/:inv_id",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.editInventoryView)
)

// Process update
router.post(
  "/update",
  checkEmployeeOrAdmin,
  invValidate.invRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.updateInventory)
)

/* ============================
   Delete Inventory (protected)
============================ */

// Show delete confirmation
router.get(
  "/delete/:inv_id",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteInventoryView)
)

// Actually delete
router.post(
  "/delete",
  checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventoryItem)
)

module.exports = router

