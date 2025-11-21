const utilities = require("../utilities")

const baseController = {}

/* *****************************
 * Build the Home page view
 ****************************** */
baseController.buildHome = async function (req, res, next) {
  let nav = await utilities.getNav()   // MUST NOT be commented out

  res.render("index", {
    title: "Home",
    nav,
  })
}

/*********************************
 * Trigger Intertional 500 Error
 **********************************/
baseController.triggerError = async function (req, res, next) {
    throw new Error("International 500 error for testing.")
}

module.exports = baseController

