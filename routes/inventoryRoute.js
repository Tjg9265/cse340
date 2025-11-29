// routes/inventoryRoute.js

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

// Classification listing page
router.get(
  "/type/:classification_id",
  utilities.handleErrors(invController.buildByClassificationId)
)

// Vehicle detail page
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

// View
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
)

// Process
router.post(
  "/add-classification",
  classValidate.classRules(),
  classValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
)

/* ============================
   Add Inventory
============================ */

// View
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
)

// Process
router.post(
  "/add-inventory",
  invValidate.invRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.addInventory)
)

/* ============================
   Edit Inventory
============================ */

// Edit view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)

// Process update
router.post(
  "/edit",
  invValidate.invRules(),
  invValidate.checkInvData,
  utilities.handleErrors(invController.updateInventory)
)

/* ============================
   Delete Inventory
============================ */

// Delete confirmation view
router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteInventoryView)
)

// Process delete
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventoryItem)
)

module.exports = router
