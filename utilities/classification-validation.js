const { body, validationResult } = require("express-validator")
const utilities = require(".")

const classValidate = {}

/* **********************************
 *  Classification Validation Rules
 ********************************** */
classValidate.classRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a classification name.")
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Letters and numbers only. No spaces or special characters.")
  ]
}

/* **********************************
 *  Check Classification Data
 ********************************** */
classValidate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors,
      classification_name
    })
  }

  next()
}

module.exports = classValidate

