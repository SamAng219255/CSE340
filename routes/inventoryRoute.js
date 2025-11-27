// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by classification view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

// Route to add classification view
router.get("/add/type", utilities.handleErrors(invController.buildAddClassification));
// Route to process adding classification
router.post("/add/type", 
  invValidate.addTypeRules(),
  invValidate.checkAddTypeData,
  utilities.handleErrors(invController.addClassification)
);

// Route to add inventory view
router.get("/add/vehicle", utilities.handleErrors(invController.buildAddInventory));
// Route to process adding inventory item
router.post("/add/vehicle", 
  invValidate.addVehicleRules(),
  invValidate.checkAddVehicleData,
  utilities.handleErrors(invController.addInventoryItem)
);

// Route to management view
router.get("/", utilities.checkLoginEmployee, utilities.handleErrors(invController.buildManagement));

// Route to inventory API
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to modify inventory view
router.get("/edit/:inv_id", utilities.handleErrors(invController.buildEditInventory));
// Route to process editting inventory item
router.post("/edit/", 
  invValidate.editVehicleRules(),
  invValidate.checkEditVehicleData,
  utilities.handleErrors(invController.editInventoryItem)
);

// Route to delete inventory confirmation view
router.get("/delete/:inv_id", utilities.handleErrors(invController.buildDeleteInventoryConfirm));
// Route to process deleting inventory item
router.post("/delete/", 
  invValidate.deleteVehicleRules(),
  invValidate.checkDeleteVehicleData,
  utilities.handleErrors(invController.deleteInventoryItem)
);

module.exports = router;