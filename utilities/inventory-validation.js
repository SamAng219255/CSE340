const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const commentModel = require("../models/comment-model")
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
*  Edit Vehicle Validation Rules
* ********************************* */
validate.editVehicleRules = () => {
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
    
    body("inv_id")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Missing inventory item id. Please return to management page and try again.")
    .custom(async (inv_id) => {
      const inventoryExists = await inventoryModel.checkExistingInventoryId(inv_id);
      if(!inventoryExists) {
        throw new Error("Invalid inventory item id. Please return to management page and try again.")
      }
    }),
  ]
}

/* ******************************
 * Check data and return errors or continue to edit
 * ***************************** */
validate.checkEditVehicleData = async (req, res, next) => {
  const {
    inv_id,
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

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const oldData = await inventoryModel.getInventoryByVehicleId(inv_id);
    const name = `${oldData.inv_make} ${oldData.inv_model}`;
    const classificationOptions = await utilities.getClassificationOptions(classification_id);
    res.render("inventory/edit-inventory", {
      errors,
      pageStyle: null,
      title: `Edit ${name}`,
      nav,
      inv_id,
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

/*  **********************************
*  Delete Vehicle Validation Rules
* ********************************* */
validate.deleteVehicleRules = () => {
  return [
    body("inv_id")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Missing inventory item id. Please return to management page and try again.")
    .custom(async (inv_id) => {
      const inventoryExists = await inventoryModel.checkExistingInventoryId(inv_id);
      if(!inventoryExists) {
        throw new Error("Invalid inventory item id. Please return to management page and try again.")
      }
    }),
  ]
}

/* ******************************
 * Check data and return errors or continue to delete
 * ***************************** */
validate.checkDeleteVehicleData = async (req, res, next) => {
  let {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = req.body;

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const oldData = await invModel.getInventoryByVehicleId(inv_id);
    inv_make = oldData.inv_make || inv_make;
    inv_model = oldData.inv_model || inv_model;
    inv_year = oldData.inv_year || inv_year;
    inv_price = oldData.inv_price || inv_price;
    const name = `${inv_make} ${inv_model}`;
    res.render("inventory/delete-inventory", {
      errors,
      pageStyle: null,
      title: `Delete ${name}`,
      nav,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    })
    return
  }
  next()
}

/*  **********************************
*  Comment Management Validation Rules
* ********************************* */
validate.commentRules = () => {
  return [
    body("action")
      .unescape()
      .isIn(["Post Review", "Delete Review", "Edit Review"]),

    body("comment_body")
      .if(body("action").unescape().isIn(["Post Review", "Edit Review"]))
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide text for the review."),

    body("comment_id")
      .if(body("action").unescape().isIn(["Delete Review", "Edit Review"]))
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Missing comment id. Please try again.")
      .custom(async (comment_id) => {
        const commentExists = await commentModel.checkExistingCommentId(comment_id);
        if(!commentExists) {
          throw new Error("Comment does not exist. It may have been deleted. If you believe this to be a mistake, please try again later.")
        }
      }),
  ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkCommentData = async (req, res, next) => {
  const {
    action,
    comment_id,
    comment_body,
  } = req.body

  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const commentOptions = {
      loggedin: res.locals.loggedin,
      accountData: res.locals.accountData,
    };
    if(action == 'Post Review') {
      commentOptions.postStickyText = comment_body;
    }
    else if(action == 'Edit Review') {
      commentOptions.editStickyText = comment_body;
      commentOptions.editStickyId = comment_id;
    }

    const inv_id = req.params.vehicleId;
    const invData = await inventoryModel.getInventoryByVehicleId(inv_id);
    const commentData = await commentModel.getCommentsByInventoryId(inv_id);
    const description = await utilities.buildVehicleDescription(invData[0]);
    const commentSection = await utilities.buildCommentsSection(commentData, inv_id, commentOptions);
    const nav = await utilities.getNav();
    const vehicleName = `${invData[0].inv_year} ${invData[0].inv_make} ${invData[0].inv_model}`;
    res.render("./inventory/vehicle", {
      errors,
      title: vehicleName,
      pageStyle: "vehicle",
      nav,
      description,
      commentSection,
    });
    return
  }
  next()
}

module.exports = validate