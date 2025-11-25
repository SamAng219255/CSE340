const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get specific inventory item by inv_id
 * ************************** */
async function getInventoryByVehicleId(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [vehicle_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryByVehicleId error " + error)
  }
}

/* **********************
 *   Check for existing classifcation by name
 * ********************* */
async function checkExistingClassificationName(classification_name) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1";
    const type_name = await pool.query(sql, [classification_name]);
    return type_name.rowCount;
  }
  catch(error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing classifcation by id
 * ********************* */
async function checkExistingClassificationId(classification_id) {
  try {
    const sql = "SELECT * FROM classification WHERE classification_id = $1";
    const type_name = await pool.query(sql, [classification_id]);
    return type_name.rowCount;
  }
  catch(error) {
    return error.message;
  }
}

/* **********************
 *   Check for existing inventory by id
 * ********************* */
async function checkExistingInventoryId(inv_id) {
  try {
    const sql = "SELECT * FROM inventory WHERE inv_id = $1";
    const type_name = await pool.query(sql, [inv_id]);
    return type_name.rowCount;
  }
  catch(error) {
    return error.message;
  }
}

/* *****************************
*   Add Classification
* *************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Add Inventory Item
* *************************** */
async function addInventoryItem(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
  } catch (error) {
    return error.message
  }
}

/* *****************************
*   Edit Inventory Item
* *************************** */
async function editInventoryItem(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
  try {
    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id]).rows[0]
  } catch (error) {
    return error.message
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByVehicleId,
  checkExistingClassificationName,
  checkExistingClassificationId,
  checkExistingInventoryId,
  addClassification,
  addInventoryItem,
  editInventoryItem
};