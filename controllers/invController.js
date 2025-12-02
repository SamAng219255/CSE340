const invModel = require("../models/inventory-model")
const commentModel = require("../models/comment-model")
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
  const inv_id = req.params.vehicleId;
  const invData = await invModel.getInventoryByVehicleId(inv_id);
  const commentData = await commentModel.getCommentsByInventoryId(inv_id);
  const description = await utilities.buildVehicleDescription(invData[0]);
  const commentSection = await utilities.buildCommentsSection(commentData, inv_id, {loggedin: res.locals.loggedin, accountData: res.locals.accountData});
  let nav = await utilities.getNav();
  const vehicleName = `${invData[0].inv_year} ${invData[0].inv_make} ${invData[0].inv_model}`;
  res.render("./inventory/vehicle", {
    title: vehicleName,
    pageStyle: "vehicle",
    nav,
    description,
    commentSection,
    errors: null,
  });
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationOptions = await utilities.getClassificationOptions()
  res.render("./inventory/management", {
    title: "Manage Inventory",
    pageStyle: null,
    nav,
    errors: null,
    classificationOptions,
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
  const classificationOptions = await utilities.getClassificationOptions();
    req.flash(
      "notice",
      `Successfully added "${inv_year} ${inv_make} ${inv_model}" to the inventory list.`
    )
    res.status(201).render("./inventory/management", {
      title: "Manage Inventory",
      pageStyle: null,
      nav,
      errors: null,
      classificationOptions,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const data = await invModel.getInventoryByVehicleId(inv_id);
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
  } = data[0];
  const name = `${inv_make} ${inv_model}`;
  const classificationOptions = await utilities.getClassificationOptions(classification_id);
  res.render("./inventory/edit-inventory", {
    title: `Edit ${name}`,
    pageStyle: null,
    nav,
    errors: null,
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
    initial: true
  });
}
invCont.editInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav();
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
  } = req.body;

  const editResult = await invModel.editInventoryItem(
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
  );

  if (editResult) {
    const classificationOptions = await utilities.getClassificationOptions();
    req.flash(
      "notice",
      `Successfully edited "${inv_year} ${inv_make} ${inv_model}".`
    )
    res.status(201).render("./inventory/management", {
      title: "Manage Inventory",
      pageStyle: null,
      nav,
      errors: null,
      classificationOptions,
    });
  }
  else {
    const classificationOptions = await utilities.getClassificationOptions(classification_id);
    const oldData = await invModel.getInventoryByVehicleId(inv_id);
    const name = `${oldData.inv_make} ${oldData.inv_model}`;
    req.flash("notice", "Failed to edit inventory item.")
    res.status(501).render("inventory/edit-inventory", {
      pageStyle: null,
      title: `Edit ${name}`,
      nav,
      errors: null,
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
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteInventoryConfirm = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const data = await invModel.getInventoryByVehicleId(inv_id);
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = data[0];
  const name = `${inv_make} ${inv_model}`;
  res.render("./inventory/delete-inventory", {
    title: `Delete ${name}`,
    pageStyle: null,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  });
}
invCont.deleteInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav();
  let {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = req.body;
  const oldData = await invModel.getInventoryByVehicleId(inv_id);
  inv_make = oldData.inv_make || inv_make;
  inv_model = oldData.inv_model || inv_model;
  inv_year = oldData.inv_year || inv_year;
  inv_price = oldData.inv_price || inv_price;

  const deleteCommentsResult = await commentModel.deleteCommentsByInventoryId(inv_id);

  const deleteResult = deleteCommentsResult ? await invModel.deleteInventoryItem(inv_id) : false;

  if (deleteResult) {
    const classificationOptions = await utilities.getClassificationOptions();
    req.flash(
      "notice",
      `Successfully deleted "${inv_year} ${inv_make} ${inv_model}".`
    )
    res.status(201).render("./inventory/management", {
      title: "Manage Inventory",
      pageStyle: null,
      nav,
      errors: null,
      classificationOptions,
    });
  }
  else {
    const name = `${inv_make} ${inv_model}`;
    req.flash("notice", "Failed to delete inventory item.")
    res.status(501).render("inventory/delete-inventory", {
      pageStyle: null,
      title: `Delete ${name}`,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    })
  }
}

/* ***************************
 *  Process Comment Actions
 * ************************** */
invCont.handleComments = async function (req, res, next) {
  const {
    action,
    comment_id,
    comment_body,
  } = req.body
  const inv_id = req.params.vehicleId;
  const invData = await invModel.getInventoryByVehicleId(inv_id);
  const description = await utilities.buildVehicleDescription(invData[0]);
  const nav = await utilities.getNav();
  const vehicleName = `${invData[0].inv_year} ${invData[0].inv_make} ${invData[0].inv_model}`;
  const commentOptions = {loggedin: res.locals.loggedin, accountData: res.locals.accountData};

  const renderOptions = {message: "An unknown error has occured.", status: 501};

  if(action == 'Post Review') {
    const postResult = await commentModel.addComment(comment_body, res.locals.accountData.account_id, inv_id);

    if(postResult) {
      renderOptions.message = 'The review has been successfully posted.';
      renderOptions.status = 201;
    }
    else {
      renderOptions.message = 'Sorry, there was an error posting the review.';
      renderOptions.status = 500;
      commentOptions.postStickyText = comment_body;
    }
  }
  else if(action == 'Edit Review') {
    const editResult = await commentModel.editComment(comment_id, comment_body);

    if(editResult) {
      renderOptions.message = 'The review has been successfully edited.';
      renderOptions.status = 201;
    }
    else {
      renderOptions.message = 'Sorry, there was an error editing the review.';
      renderOptions.status = 500;
      commentOptions.editStickyText = comment_body;
      commentOptions.editStickyId = comment_id;
    }
  }
  else if(action == 'Delete Review') {
    const deleteResult = await commentModel.deleteCommentById(comment_id);

    if(deleteResult) {
      renderOptions.message = 'The review has been successfully deleted.';
      renderOptions.status = 201;
    }
    else {
      renderOptions.message = 'Sorry, there was an error deleting the review.';
      renderOptions.status = 500;
    }
  }

  const commentData = await commentModel.getCommentsByInventoryId(inv_id);
  const commentSection = await utilities.buildCommentsSection(commentData, inv_id, commentOptions);
  req.flash("notice", renderOptions.message)
  res.status(renderOptions.status).render("./inventory/vehicle", {
    title: vehicleName,
    pageStyle: "vehicle",
    nav,
    description,
    commentSection,
    errors: null,
  });
}

module.exports = invCont