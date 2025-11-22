const { body, validationResult } = require("express-validator")
const utilities = require(".")

const invValidate = {}

/* **********************************
 *  Inventory Validation Rules
 ********************************** */
invValidate.invRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please choose a classification."),

    body("inv_make")
      .trim().escape()
      .notEmpty().withMessage("Please provide a make."),

    body("inv_model")
      .trim().escape()
      .notEmpty().withMessage("Please provide a model."),

    body("inv_year")
      .trim()
      .notEmpty().withMessage("Year is required.")
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Year must be 1900–2100."),

    body("inv_description")
      .trim().escape()
      .notEmpty().withMessage("Description is required."),

    body("inv_image")
      .trim()
      .notEmpty().withMessage("Image path is required."),

    body("inv_thumbnail")
      .trim()
      .notEmpty().withMessage("Thumbnail path is required."),

    body("inv_price")
      .notEmpty().withMessage("Price is required.")
      .isFloat({ min: 0 })
      .withMessage("Price must be a valid number."),

    body("inv_miles")
      .notEmpty().withMessage("Mileage is required.")
      .isInt({ min: 0 })
      .withMessage("Miles must be a positive number."),

    body("inv_color")
      .trim().escape()
      .notEmpty().withMessage("Color is required.")
  ]
}

/* **********************************
 *  Check Inventory Data
 ********************************** */
invValidate.checkInvData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    return res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationList,
      errors,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    })
  }

  next()
}

module.exports = invValidate

