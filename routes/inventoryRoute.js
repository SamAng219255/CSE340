// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by inventory view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));
// Route to process comments by inventory item
router.post(
  "/detail/:vehicleId",
  utilities.checkAllowedLogin({minimumLevel: 'Admin', idMatches: utilities.matchesComment, mode: 'or'}),
  invValidate.commentRules(),
  invValidate.checkCommentData,
  utilities.handleErrors(invController.handleComments)
);

// Route to add classification view
router.get("/add/type",
  utilities.checkAllowedLogin({minimumLevel:'Employee'}),
  utilities.handleErrors(invController.buildAddClassification)
);
// Route to process adding classification
router.post("/add/type", 
  utilities.checkAllowedLogin({minimumLevel:'Employee'}),
  invValidate.addTypeRules(),
  invValidate.checkAddTypeData,
  utilities.handleErrors(invController.addClassification)
);

// Route to add inventory view
router.get("/add/vehicle",
  utilities.checkAllowedLogin({minimumLevel:'Employee'}),
  utilities.handleErrors(invController.buildAddInventory)
);
// Route to process adding inventory item
router.post("/add/vehicle", 
  utilities.checkAllowedLogin({minimumLevel:'Employee'}),
  invValidate.addVehicleRules(),
  invValidate.checkAddVehicleData,
  utilities.handleErrors(invController.addInventoryItem)
);

// Route to management view
router.get("/",
  utilities.checkAllowedLogin({minimumLevel:'Employee'}),
  utilities.handleErrors(invController.buildManagement)
);

// Route to inventory API
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to modify inventory view
router.get("/edit/:inv_id",
  utilities.checkAllowedLogin({minimumLevel:'Employee'}),
  utilities.handleErrors(invController.buildEditInventory)
);
// Route to process editting inventory item
router.post("/edit/", 
  utilities.checkAllowedLogin({minimumLevel:'Employee'}),
  invValidate.editVehicleRules(),
  invValidate.checkEditVehicleData,
  utilities.handleErrors(invController.editInventoryItem)
);

// Route to delete inventory confirmation view
router.get("/delete/:inv_id",
  utilities.checkAllowedLogin({minimumLevel:'Employee'}),
  utilities.handleErrors(invController.buildDeleteInventoryConfirm)
);
// Route to process deleting inventory item
router.post("/delete/", 
  utilities.checkAllowedLogin({minimumLevel:'Employee'}),
  invValidate.deleteVehicleRules(),
  invValidate.checkDeleteVehicleData,
  utilities.handleErrors(invController.deleteInventoryItem)
);

module.exports = router;