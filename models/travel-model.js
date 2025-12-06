const pool = require("../database/")

/* Get all entries for a specific account */
async function getEntriesByAccountId(account_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM travel_entry
       WHERE account_id = $1
       ORDER BY entry_date DESC`,
      [account_id]
    )
    return result.rows
  } catch (error) {
    throw error
  }
}

/* Insert a new travel entry */
async function addEntry(account_id, location_name, entry_title, entry_content) {
  try {
    const result = await pool.query(
      `INSERT INTO travel_entry
      (account_id, location_name, entry_title, entry_content)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [account_id, location_name, entry_title, entry_content]
    )
    return result.rows[0]
  } catch (error) {
    throw error
  }
}

/* Get single entry */
async function getEntryById(entry_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM travel_entry
       WHERE entry_id = $1`,
      [entry_id]
    )
    return result.rows[0]
  } catch (error) {
    throw error
  }
}

module.exports = {
  getEntriesByAccountId,
  addEntry,
  getEntryById,
}
