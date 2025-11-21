const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    pageStyle: "inventory",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory by vehicle view
 * ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId;
  const data = await invModel.getInventoryByVehicleId(vehicle_id);
  const description = await utilities.buildVehicleDescription(data[0]);
  let nav = await utilities.getNav();
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./inventory/vehicle", {
    title: vehicleName,
    pageStyle: "vehicle",
    nav,
    description,
    errors: null,
  });
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Manage Inventory",
    pageStyle: null,
    nav,
    errors: null,
  });
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Vehicle Type",
    pageStyle: null,
    nav,
    errors: null,
  });
}
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const addResult = await invModel.addClassification(
    classification_name
  );

  if (addResult) {
    req.flash(
      "notice",
      `Successfully added "${classification_name}" to the list of classifications.`
    )
    res.status(201).render("./inventory/management", {
      title: "Manage Inventory",
      pageStyle: null,
      nav,
      errors: null,
    });
  }
  else {
    req.flash("notice", "Failed to add classification.")
    res.status(501).render("inventory/add-classification", {
      pageStyle: null,
      title: "Add New Vehicle Type",
      nav,
      errors: null,
      classification_name,
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationOptions = await utilities.getClassificationOptions();
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory Item",
    pageStyle: null,
    nav,
    errors: null,
    classificationOptions,
  });
}
invCont.addInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav();
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
  } = req.body;

  const addResult = await invModel.addInventoryItem(
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
  );

  if (addResult) {
    req.flash(
      "notice",
      `Successfully added "${inv_year} ${inv_make} ${inv_model}" to the inventory list.`
    )
    res.status(201).render("./inventory/management", {
      title: "Manage Inventory",
      pageStyle: null,
      nav,
      errors: null,
    });
  }
  else {
    const classificationOptions = await utilities.getClassificationOptions(classification_id);
    req.flash("notice", "Failed to add inventory item.")
    res.status(501).render("inventory/add-inventory", {
      pageStyle: null,
      title: "Add New Inventory Item",
      nav,
      errors: null,
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
  }
}

module.exports = invCont