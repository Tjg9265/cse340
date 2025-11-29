// utilities/accountAuthorization.js

const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
 *  JWT Authentication Middleware
 *
 *  - Checks for JWT in cookie "jwt"
 *  - Verifies the token
 *  - Stores payload in res.locals.accountData
 *  - Redirects to /account/login if invalid
 **************************************** */
function checkJWTToken(req, res, next) {
  // Pull token from cookie
  const token = req.cookies.jwt

  // No token present
  if (!token) {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }

  try {
    // Verify JWT
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    // Store payload for views and controllers
    res.locals.accountData = payload

    return next()
  } catch (error) {
    console.error("JWT verification error:", error)

    // Kill invalid cookie
    res.clearCookie("jwt")

    // Send user back to login
    req.flash("notice", "Invalid or expired session. Please log in again.")
    return res.redirect("/account/login")
  }
}

module.exports = { checkJWTToken }
