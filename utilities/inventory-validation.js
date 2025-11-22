const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
*  Add Classification Validation Rules
* ********************************* */
validate.addTypeRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("classification_name")
    .trim()
    .escape()
    .notEmpty()
    .isAlphanumeric()
    .withMessage("Invalid classification name.")
    .custom(async (classification_name) => {
      const classificationExists = await inventoryModel.checkExistingClassificationName(classification_name);
      if(classificationExists) {
        throw new Error("Classification already exists.")
      }
    }),
  ]
}

/* ******************************
 * Check data and return errors or continue to addType
 * ***************************** */
validate.checkAddTypeData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      pageStyle: null,
      title: "Add New Vehicle Type",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
*  Add Vehicle Validation Rules
* ********************************* */
validate.addVehicleRules = () => {
  return [
    body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a make."),
    
    body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a model."),
    
    body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .isInt({ min: 1000, max: 9999, allow_leading_zeroes: false })
    .withMessage("Please provide a valid year."),
    
    body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a description."),
    
    body("inv_image")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide an image path."),
    
    body("inv_thumbnail")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a thumbnail path."),
    
    body("inv_price")
    .trim()
    .escape()
    .notEmpty()
    .isInt({ gt: 0, max: 999999999 })
    .withMessage("Please provide a valid price."),
    
    body("inv_miles")
    .trim()
    .escape()
    .notEmpty()
    .isInt({ min: 0 })
    .withMessage("Please provide a valid mile count."),
    
    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a color."),
    
    body("classification_id")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Please provide a classification.")
    .custom(async (classification_id) => {
      const classificationExists = await inventoryModel.checkExistingClassificationId(classification_id);
      if(!classificationExists) {
        throw new Error("Classification does not exist. Add it first or use an existing classification.")
      }
    }),
  ]
}

/* ******************************
 * Check data and return errors or continue to addType
 * ***************************** */
validate.checkAddVehicleData = async (req, res, next) => {
  const {
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
  } = req.body

  console.log({
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
  });

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationOptions = await utilities.getClassificationOptions(classification_id);
    res.render("inventory/add-inventory", {
      errors,
      pageStyle: null,
      title: "Add New Vehicle Type",
      nav,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classificationOptions,
    })
    return
  }
  next()
}

module.exports = validate