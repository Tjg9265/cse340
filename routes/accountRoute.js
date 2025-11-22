// routes/accountRoute.js

const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Login view
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Registration view
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Process registration
router.post(
  "/register",
  regValidate.registrationRules(),  // ✅ fixed name
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router

