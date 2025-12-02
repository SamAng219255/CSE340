const pool = require("../database/")

/* ***************************
 *  Delete all comments associated with a given inv_id
 * ************************** */
async function deleteCommentsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `DELETE FROM comment WHERE inv_id = $1;`,
      [inv_id]
    );
    return data;
  }
  catch (error) {
    console.error("deleteCommentsByInventoryId error " + error)
  }
}

/* ***************************
 *  Get all comment details associated with a given inv_id
 * ************************** */
async function getCommentsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM comment_details WHERE inv_id = $1;`,
      [inv_id]
    );
    return data.rows;
  }
  catch (error) {
    console.error("getCommentsByInventoryId error " + error)
  }
}

/* **********************
 *   Check for existing comment by id
 * ********************* */
async function checkExistingCommentId(comment_id) {
  try {
    const sql = "SELECT * FROM comment WHERE comment_id = $1";
    const type_name = await pool.query(sql, [comment_id]);
    return type_name.rowCount;
  }
  catch(error) {
    return error.message;
  }
}

/* ***************************
 *  Get all comments associated with a given inv_id
 * ************************** */
async function getCommentById(comment_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM comment WHERE comment_id = $1;`,
      [comment_id]
    );
    return data.rows;
  }
  catch (error) {
    console.error("getCommentById error " + error)
  }
}



/* ***************************
 *  Get all comments associated with a given inv_id
 * ************************** */
async function addComment(comment_body, account_id, inv_id) {
  try {
    const data = await pool.query(
      `INSERT INTO public.comment (comment_body, account_id, inv_id) VALUES ($1, $2, $3) RETURNING *`,
      [comment_body, account_id, inv_id]
    );
    return data.rows;
  }
  catch (error) {
    console.error("addComment error " + error)
  }
}

/* ***************************
 *  Get all comments associated with a given inv_id
 * ************************** */
async function editComment(comment_id, comment_body) {
  try {
    const data = await pool.query(
      `UPDATE comment SET comment_body = $1 WHERE comment_id = $2 RETURNING *`,
      [comment_body, comment_id]
    );
    return data.rows;
  }
  catch (error) {
    console.error("editComment error " + error)
  }
}

/* ***************************
 *  Get all comments associated with a given inv_id
 * ************************** */
async function deleteCommentById(comment_id) {
  try {
    const data = await pool.query(
      `DELETE FROM comment WHERE comment_id = $1;`,
      [comment_id]
    );
    return data;
  }
  catch (error) {
    console.error("deleteCommentById error " + error)
  }
}

module.exports = {
  deleteCommentsByInventoryId,
  getCommentsByInventoryId,
  checkExistingCommentId,
  getCommentById,
  addComment,
  editComment,
  deleteCommentById,
};