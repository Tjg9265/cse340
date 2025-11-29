// utilities/accountAuthorization.js

const jwt = require("jsonwebtoken")
require("dotenv").config()

/**
 * Require a valid JWT (any account type).
 * Used to protect /account and account update routes.
 */
function checkJWTToken(req, res, next) {
  const token = req.cookies.jwt

  if (!token) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    // Make account data available in views
    res.locals.accountData = payload
    res.locals.loggedIn = true
    next()
  } catch (error) {
    console.error("checkJWTToken error:", error)
    res.clearCookie("jwt")
    req.flash("notice", "Invalid session. Please log in again.")
    return res.redirect("/account/login")
  }
}

/**
 * Require Employee or Admin.
 * Used to protect inventory management routes.
 */
function checkEmployeeOrAdmin(req, res, next) {
  const token = req.cookies.jwt

  if (!token) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    if (payload.account_type === "Employee" || payload.account_type === "Admin") {
      res.locals.accountData = payload
      res.locals.loggedIn = true
      return next()
    }

    req.flash("notice", "You are not authorized to access that page.")
    return res.redirect("/account")
  } catch (error) {
    console.error("checkEmployeeOrAdmin error:", error)
    res.clearCookie("jwt")
    req.flash("notice", "Invalid session. Please log in again.")
    return res.redirect("/account/login")
  }
}

module.exports = {
  checkJWTToken,
  checkEmployeeOrAdmin
}
