/******************************************
 * Main server file for CSE Motors
 ******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const utilities = require("./utilities");
require("dotenv").config();
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");

/* ***********************
 * Express App Setup
 *************************/
const app = express();

/* ***********************
 * View Engine & Layout Setup
 *************************/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Static Files
 *************************/
app.use(express.static(path.join(__dirname, "public")));

/* ***********************
 * Routes
 *************************/
const staticRoutes = require("./routes/static");
app.use("/", staticRoutes);
app.use("/inv", inventoryRoute);

// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Intentional 500 Error Route (Assignment Task 3)
app.get(
  "/trigger-error",
  utilities.handleErrors(baseController.triggerError)
);

/* ***********************
 * 404 Error Route
 * MUST be last route before error handler
 *************************/
app.use(async (req, res, next) => {
  next({
    status: 404,
    message: "Sorry, we appear to have lost that page.",
  });
});

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  let message;
  if (err.status == 404) {
    message = err.message;
  } else {
    message = "Oh no! There was a crash. Maybe try a different route?";
  }

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

/* ***********************
 * Start Server
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});

