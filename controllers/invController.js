const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classification_id
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    if(!data || data.length === 0) {
        const error = new Error("No vehicles found for this classification.")
        error.status = 404
        return next(error)
    }
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}
invCont.buildByInventoryId = async function (req, res, next) {
    const invId = req.params.invId
    const vehicleData = await invModel.getInventoryByInvId(invId)
    if (!vhicleData) {
        const error = new Error("Vehicle not found.")
        error.status = 404
        throw error
    }
    const nav = await utilities.getNav()
    const detail = await utilities.buildVehicleDetail(vehicleData)
    const title = `${vehicleData.inv_year} ${vehicleData.inv_make} ${vehicleData.inv_model}`
    res.render("./inventory/detail", {
        title,
        nav,
        detail,
    })
}
module.exports = invCont
