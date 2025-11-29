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
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process login (no extra validation middleware for now)
router.post(
  "/login",
  utilities.handleErrors(accountController.accountLogin)
)

// Logout
router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)

// Account dashboard (protected)
router.get(
  "/",
  checkJWTToken,
  utilities.handleErrors(accountController.buildAccountPage)
)

// ===== Account Update Routes =====

// Show update account view
router.get(
  "/update/:account_id",
  checkJWTToken,
  utilities.handleErrors(accountController.buildUpdateAccountView)
)

// Process account info update (name + email)
router.post(
  "/update",
  checkJWTToken,
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password change
router.post(
  "/update-password",
  checkJWTToken,
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router
