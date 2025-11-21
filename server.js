/***********************************
 *  Required Modules
 ***********************************/
const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const session = require("express-session")
const flash = require("connect-flash")
require("dotenv").config()

/* Database pool */
const pool = require("./database/")

/* Routes */
const staticRoutes = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")

/***********************************
 *  Create the app
 ***********************************/
const app = express()

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
    secret: process.env.SESSION_SECRET,
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
