const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ****************************************
*  Inventory by Classification
**************************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = parseInt(req.params.classification_id)
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)

    if (!data || data.length === 0) {
      const error = new Error("No vehicles found for this classification.")
      error.status = 404
      return next(error)
    }

    const nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
*  Vehicle Detail
**************************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const invId = parseInt(req.params.invId)
    const vehicleData = await invModel.getInventoryByInvId(invId)

    if (!vehicleData) {
      const error = new Error("Vehicle not found.")
      error.status = 404
      return next(error)
    }

    const nav = await utilities.getNav()
    const detail = utilities.buildVehicleDetail(vehicleData)

    const title = `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`

    res.render("./inventory/detail", {
      title,
      nav,
      detail
    })
  } catch (err) {
    next(err)
  }
}

/* ****************************************
*  Management View
**************************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver Add Classification View
**************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    classification_name: ""   // ✔ FIXED
  })
}

/* ****************************************
*  Process New Classification
**************************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  let nav = await utilities.getNav()

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", `The classification ${classification_name} was added.`)
    return res.status(200).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  }

  // ❗ MUST RETURN ERRORS FOR STICKY FORMS
  let errors = [{ msg: "Classification creation failed." }]

  return res.status(501).render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors,
    classification_name
  })
}

/* ****************************************
*  Deliver Add Inventory View
**************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  console.log("Running buildAddInventory(), inv_make default should be empty string");
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    classificationList,
    errors: null,

    // ⭐ ADD THESE DEFAULT VALUES ⭐
    classification_id: "",
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: ""
  })
}

/* ****************************************
*  Process New Inventory
**************************************** */
invCont.addInventory = async function (req, res) {
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

  let nav = await utilities.getNav()

  const result = await invModel.addInventory(
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
  )

  if (result) {
    req.flash("notice", `The ${inv_make} ${inv_model} was added successfully!`)
    return res.status(200).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  }

  req.flash("notice", "Failed to add the vehicle.")
  let classificationList = await utilities.buildClassificationList(classification_id)

  res.status(501).render("inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    classificationList,
    errors: null,
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

/* ****************************************
*  Export Controller
**************************************** */
module.exports = invCont
