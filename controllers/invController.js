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
    const inv_id = parseInt(req.params.invId)
    const vehicleData = await invModel.getInventoryById(inv_id)

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
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationList
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
    classification_name: ""
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
    return res.redirect("/inv/")
  }

  let errors = [{ msg: "Classification creation failed." }]
  res.status(501).render("inventory/add-classification", {
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
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    classificationList,
    errors: null,
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
invCont.addInventory = async function (req, res, next) {
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
    return res.redirect("/inv/")
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
* Step 1: Deliver Edit Inventory View
**************************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)

  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    ...itemData
  })
}

/* ****************************************
* Step 2: Process Update Inventory
**************************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`
    req.flash("notice", `The ${itemName} was successfully updated.`)
    return res.redirect("/inv/")
  }

  const classificationList = await utilities.buildClassificationList(classification_id)
  const itemName = `${inv_make} ${inv_model}`

  req.flash("notice", "Sorry, the update failed.")
  res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  })
}

/* ****************************************
* Step 1 Delete: Deliver Delete Confirmation View
**************************************** */
invCont.buildDeleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    ...itemData
  })
}

/* ****************************************
* Step 2 Delete: Process Delete
**************************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult.rowCount) {
    req.flash("notice", "The inventory item was successfully deleted.")
    return res.redirect("/inv/")
  }

  req.flash("notice", "Sorry, the delete failed.")
  return res.redirect(`/inv/delete/${inv_id}`)
}

module.exports = invCont

