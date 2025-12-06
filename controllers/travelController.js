const utilities = require("../utilities")
const travelModel = require("../models/travel-model")

/* Build list view */
async function buildTravelList(req, res) {
  const account_id = res.locals.accountData.account_id
  const entries = await travelModel.getEntriesByAccountId(account_id)
  let nav = await utilities.getNav()

  res.render("travel/list", {
    title: "My Travel Journal",
    nav,
    entries,
    errors: null
  })
}

/* Build add entry form */
async function buildAddEntry(req, res) {
  let nav = await utilities.getNav()

  res.render("travel/add", {
    title: "Add Travel Entry",
    nav,
    errors: null
  })
}

/* Process add entry form */
async function addEntry(req, res) {
  const account_id = res.locals.accountData.account_id
  const { location_name, entry_title, entry_content } = req.body

  const newEntry = await travelModel.addEntry(
    account_id,
    location_name,
    entry_title,
    entry_content
  )

  req.flash("notice", "Travel entry added successfully!")
  res.redirect("/travel")
}

module.exports = {
  buildTravelList,
  buildAddEntry,
  addEntry,
}
