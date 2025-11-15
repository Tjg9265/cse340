// Bring in the inventory model
const invModel = require("../models/inventory-model")

// Create object for utilities
const Util = {}

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next)

/*****************************************
 * Build Navigation
 ******************************************/
Util.getNav = async function () {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'

  data.rows.forEach((row) => {
    list += "<li>"
    list += `<a href="/inv/type/${row.classification_id}" 
              title="See our inventory of ${row.classification_name}">
              ${row.classification_name}
            </a>`
    list += "</li>"
  })

  list += "</ul>"
  return list
}

/*****************************************
 * Build classification grid
 ******************************************/
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => {
      grid += "<li>"
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" 
                title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                <img src="${vehicle.inv_thumbnail}" 
                alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
              </a>`
      grid += '<div class="namePrice">'
      grid += "<hr />"
      grid += "<h2>"
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" 
                title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                ${vehicle.inv_make} ${vehicle.inv_model}
              </a>`
      grid += "</h2>"
      grid += `<span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>`
      grid += "</div>"
      grid += "</li>"
    })
    grid += "</ul>"
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/*****************************************
 * Build Vehicle Detail Page
 ******************************************/
Util.buildVehicleDetail = async function (vehicle) {
  let detail = ""

  detail += `<section class="vehicle-detail">`

  detail += `
    <div class="vehicle-image">
      <img src="${vehicle.inv_image}" 
           alt="Image of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors" />
    </div>
  `

  detail += `
    <div class="vehicle-info">
      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>

      <p class="price"><strong>Price:</strong> 
        $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}
      </p>

      <p><strong>Mileage:</strong> 
        ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles
      </p>

      <p><strong>Color:</strong> ${vehicle.inv_color}</p>

      <p class="description">
        <strong>Description:</strong> ${vehicle.inv_description}
      </p>
    </div>
  `

  detail += "</section>"
  return detail
}

/*****************************************
 * Export the Util object
 ******************************************/
module.exports = Util
