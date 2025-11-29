// utilities/account-validation.js

const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")

const validate = {}

/* **********************************
 *  Registration Data Validation Rules
 ********************************** */
validate.registrationRules = () => {
  return [
    // First name
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // Last name
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // Email
    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail(),

    // Password
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters long and include uppercase, lowercase, number, and symbol."
      ),
  ]
}

/* **********************************
 *  Check Registration Data
 ********************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = validationResult(req)

  // Check if email already exists
  if (!errors.isEmpty() === false) {
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExists) {
      errors.errors.push({
        value: account_email,
        msg: "Email already exists. Please log in or use a different email.",
        param: "account_email",
        location: "body"
      })
    }
  }

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    return res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email
      // Password not returned
    })
  }

  next()
}

/* **********************************
 *  Update Account Validation Rules
 ********************************** */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("First name is required."),
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Last name is required."),
    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail(),
    body("account_id")
      .notEmpty()
      .withMessage("Account id is required.")
  ]
}

/* **********************************
 *  Check Update Account Data
 ********************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body

  let errors = validationResult(req)

  // Check if email already exists for another account
  if (!errors.isEmpty() === false) {
    const emailExistsForOther = await accountModel.checkExistingEmailForUpdate(
      account_email,
      account_id
    )
    if (emailExistsForOther) {
      errors.errors.push({
        value: account_email,
        msg: "That email is already in use by another account.",
        param: "account_email",
        location: "body"
      })
    }
  }

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const account = {
      account_id,
      account_firstname,
      account_lastname,
      account_email
    }

    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account
    })
  }

  next()
}

/* **********************************
 *  Update Password Validation Rules
 ********************************** */
validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        "Password must be at least 12 characters long and include uppercase, lowercase, number, and symbol."
      ),
    body("account_id")
      .notEmpty()
      .withMessage("Account id is required.")
  ]
}

/* **********************************
 *  Check Update Password Data
 ********************************** */
validate.checkUpdatePasswordData = async (req, res, next) => {
  const { account_id } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const account = await accountModel.getAccountById(account_id)

    return res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account
    })
  }

  next()
}

module.exports = validate
