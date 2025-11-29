// utilities/jwt-helper.js

const jwt = require("jsonwebtoken")
require("dotenv").config()

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h"
  })
}

module.exports = { generateAccessToken }
