const pool = require("../database/")



/* *****************************
 *   Register new account
 ***************************** */
async function registerAccount(firstname, lastname, email, password) {
  try {
    const sql = `
      INSERT INTO account 
        (account_firstname, account_lastname, account_email, account_password, account_type)
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *
    `
    const result = await pool.query(sql, [firstname, lastname, email, password])
    return result.rows[0]
  } catch (error) {
    console.error("registerAccount error:", error)
    return null
  }
}

/* *****************************
 *   Check if email exists
 ***************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rowCount > 0
  } catch (error) {
    console.error("checkExistingEmail error:", error)
    return false
  }
}

/* *****************************
 *   Get account by email
 ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rows[0]
  } catch (error) {
    console.error("getAccountByEmail error:", error)
    return null
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  getAccountByEmail
}
