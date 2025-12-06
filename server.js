/***********************************
 *  Required Modules
 ***********************************/
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config()
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")


/* Database pool */
const pool = require("./database/")

/* Routes */
const staticRoutes = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const travelRoute = require("./routes/travelRoute")
app.use("/travel", travelRoute)


/***********************************
 *  Create the app
 ***********************************/
const app = express()
app.use(cookieParser())

// Make login state & account data available to all views
app.use((req, res, next) => {
  const token = req.cookies.jwt

  if (!token) {
    res.locals.loggedIn = false
    res.locals.accountData = null
    return next()
  }

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    res.locals.loggedIn = true
    res.locals.accountData = payload
  } catch (err) {
    console.error("Global JWT middleware error:", err)
    res.clearCookie("jwt")
    res.locals.loggedIn = false
    res.locals.accountData = null
  }

  next()
})



/***********************************
 *  Static Files
 ***********************************/
app.use(express.static(path.join(__dirname, "public")))

/***********************************
 *  Body Parser
 ***********************************/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/***********************************
 *  Session Middleware
 ***********************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: "superSecretPassword123!@#",

    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
)

/***********************************
 *  Flash Messages
 ***********************************/
app.use(flash())
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res)
  next()
})

/***********************************
 *  View Engine (EJS)
 ***********************************/
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(expressLayouts);
app.set("layout", "./layouts/layout");


/***********************************
 *  Routes
 ***********************************/
app.use("/", staticRoutes)
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)

/***********************************
 *  Start Server
 ***********************************/
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`CSE340 app running on port ${PORT}`)
})
