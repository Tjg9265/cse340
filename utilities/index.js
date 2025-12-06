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
  
  // ⭐ Add Adventure Log link here
  list += '<li><a href="/travel" title="Adventure Log">Adventure Log</a></li>'

  data.forEach((row) => {
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

/* ****************************************
 * Build Classification Select List
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classification_id" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  
  data.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`

    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }

    classificationList += `>${row.classification_name}</option>`
  })

  classificationList += "</select>"
  return classificationList
}

Util.buildVehicleDetail = function (vehicle) {
  let detail = `
    <section class="vehicle-detail">
      <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}">
      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
      <p class="price">$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>
      <p><strong>Miles:</strong> ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)}</p>
      <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      <p class="description">${vehicle.inv_description}</p>
    </section>
  `
  return detail
}

/*****************************************
 * Login Check Middleware  ⭐ REQUIRED
 *****************************************/
Util.checkLogin = function (req, res, next) {
  if (res.locals.loggedin) {
    return next()
  }
  req.flash("notice", "Please log in to access this page.")
  return res.redirect("/account/login")
}

/*****************************************
 * Export the Util object
 ******************************************/
module.exports = Util

