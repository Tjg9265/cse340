// routes/accountRoute.js

const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")
const { checkJWTToken } = require("../utilities/accountAuthorization")

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
  regValidate.registrationRules(),   // ✔ CORRECT
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process login
router.post(
  "/login",
  regValidate.loginRules(),          // ✔ ADDED
  regValidate.checkLoginData,        // ✔ ADDED
  utilities.handleErrors(accountController.accountLogin)
)

// Logout
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)

// Protected dashboard
router.get(
  "/",
  checkJWTToken,
  utilities.handleErrors(accountController.buildAccountPage)
)

module.exports = router
