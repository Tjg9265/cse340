// utilities/account-validation.js

const utilities = require(".")
const { body, validationResult } = require("express-validator")

const validate = {}

/* **********************************
 *  Registration Validation Rules
 ********************************** */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail(),

    body("account_password")
      .trim()
      .notEmpty()
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

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    return res.render("account/register", {
      title: "Register",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  next()
}

/* **********************************
 *  Login Validation Rules
 ********************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage("Please enter a valid email address."),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Password is required.")
  ]
}

/* **********************************
 *  Check Login Data
 ********************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()

    return res.render("account/login", {
      title: "Login",
      nav,
      errors,
      account_email
    })
  }

  next()
}

module.exports = validate
