// controllers/accountController.js

const bcrypt = require("bcryptjs")
require("dotenv").config()

const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const { generateAccessToken } = require("../utilities/jwt-helper")

/* ****************************************
 *  Deliver Login view
 **************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
 *  Deliver Registration view
 **************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
 *  Process Registration
 **************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()

  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password
  } = req.body

  // Hash password
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", "Registration failed: Password hashing error.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null
    })
  }

  // Register user in DB
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    return res.redirect("/account/login")
  }

  req.flash("notice", "Registration failed.")
  return res.status(500).render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
 *  Process Login
 **************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body

  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Invalid email or password.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  }

  // Compare password
  const validPassword = await bcrypt.compare(
    account_password,
    accountData.account_password
  )

  if (!validPassword) {
    req.flash("notice", "Incorrect password.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  }

  // Create JWT payload
  const tokenPayload = {
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_type: accountData.account_type
  }

  const accessToken = generateAccessToken(tokenPayload)

  // Save JWT to cookie
  res.cookie("jwt", accessToken, {
    httpOnly: true,
    secure: false, // set true on HTTPS
    maxAge: 60 * 60 * 1000
  })

  req.flash("notice", `Welcome back, ${accountData.account_firstname}!`)
  return res.redirect("/account")
}

/* ****************************************
 *  Build Account Dashboard
 **************************************** */
async function buildAccountPage(req, res) {
  let nav = await utilities.getNav()

  res.render("account/account", {
    title: "Account Management",
    nav,
    account: res.locals.accountData,
    errors: null
  })
}

/* ****************************************
 *  Logout – clear cookie
 **************************************** */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/account/login")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccountPage,
  accountLogout
}
