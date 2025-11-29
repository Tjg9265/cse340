// models/account-model.js

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
 *   Check if email exists (any account)
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
 *   Check if email exists for other accounts (on update)
 ***************************** */
async function checkExistingEmailForUpdate(account_email, account_id) {
  try {
    const sql = `
      SELECT * 
      FROM account 
      WHERE account_email = $1
      AND account_id <> $2
    `
    const result = await pool.query(sql, [account_email, account_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("checkExistingEmailForUpdate error:", error)
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

/* *****************************
 *   Get account by ID
 ***************************** */
async function getAccountById(account_id) {
  try {
    const sql = "SELECT * FROM account WHERE account_id = $1"
    const result = await pool.query(sql, [account_id])
    return result.rows[0]
  } catch (error) {
    console.error("getAccountById error:", error)
    return null
  }
}

/* *****************************
 *   Update account info (name + email)
 ***************************** */
async function updateAccount(account_id, firstname, lastname, email) {
  try {
    const sql = `
      UPDATE account
      SET 
        account_firstname = $1,
        account_lastname  = $2,
        account_email     = $3
      WHERE account_id   = $4
      RETURNING *
    `
    const result = await pool.query(sql, [firstname, lastname, email, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("updateAccount error:", error)
    return null
  }
}

/* *****************************
 *   Update password (hash)
 ***************************** */
async function updatePassword(account_id, hashedPassword) {
  try {
    const sql = `
      UPDATE account
      SET account_password = $1
      WHERE account_id = $2
      RETURNING *
    `
    const result = await pool.query(sql, [hashedPassword, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("updatePassword error:", error)
    return null
  }
}

module.exports = {
  registerAccount,
  checkExistingEmail,
  checkExistingEmailForUpdate,
  getAccountByEmail,
  getAccountById,
  updateAccount,
  updatePassword
}
