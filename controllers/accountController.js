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
    console.error("Hash error:", error)
    req.flash("notice", "Registration failed: Password hashing error.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null
    })
  }

  // Register in DB
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
  } else {
    req.flash("notice", "Registration failed.")
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null
    })
  }
}

/* ****************************************
 *  Process Login
 **************************************** */
async function accountLogin(req, res) {
  const { account_email, account_password } = req.body
  let nav = await utilities.getNav()

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

  // Create JWT token
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
    secure: false, // set true in production HTTPS
    maxAge: 60 * 60 * 1000 // 1 hour
  })

  req.flash("notice", `Welcome back, ${accountData.account_firstname}!`)
  return res.redirect("/account")
}

/* ****************************************
 *  Build Account Dashboard
 **************************************** */
async function buildAccountPage(req, res) {
  let nav = await utilities.getNav()
  const account = res.locals.accountData

  res.render("account/account", {
    title: "Account Management",
    nav,
    account,
    errors: null
  })
}

/* ****************************************
 *  Build Update Account View
 **************************************** */
async function buildUpdateAccountView(req, res) {
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)

  const account = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Update Account",
    nav,
    account,
    errors: null
  })
}

/* ****************************************
 *  Handle Account Info Update
 **************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()

  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body

  const updatedAccount = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (!updatedAccount) {
    req.flash("notice", "Sorry, the update failed.")
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account: {
        account_id,
        account_firstname,
        account_lastname,
        account_email
      }
    })
  }

  // Regenerate JWT with updated data
  const tokenPayload = {
    account_id: updatedAccount.account_id,
    account_firstname: updatedAccount.account_firstname,
    account_lastname: updatedAccount.account_lastname,
    account_email: updatedAccount.account_email,
    account_type: updatedAccount.account_type
  }

  const accessToken = generateAccessToken(tokenPayload)

  res.cookie("jwt", accessToken, {
    httpOnly: true,
    secure: false,
    maxAge: 60 * 60 * 1000
  })

  req.flash("notice", "Account information updated.")

  res.render("account/account", {
    title: "Account Management",
    nav,
    account: tokenPayload,
    errors: null
  })
}

/* ****************************************
 *  Handle Password Change
 **************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  // Hash new password
  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    console.error("Password hash error:", error)
    req.flash("notice", "Password update failed.")
    const account = await accountModel.getAccountById(account_id)
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      account,
      errors: null
    })
  }

  const result = await accountModel.updatePassword(account_id, hashedPassword)

  if (!result) {
    req.flash("notice", "Password update failed.")
    const account = await accountModel.getAccountById(account_id)
    return res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      account,
      errors: null
    })
  }

  // We don't need to change JWT payload for password change
  const account = await accountModel.getAccountById(account_id)

  req.flash("notice", "Password updated successfully.")
  res.render("account/account", {
    title: "Account Management",
    nav,
    account: {
      account_id: account.account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email,
      account_type: account.account_type
    },
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
  buildUpdateAccountView,
  updateAccount,
  updatePassword,
  accountLogout
}
