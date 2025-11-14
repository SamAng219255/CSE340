// Needed Resources 
const express = require("express")
const router = new express.Router() 
const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

// Cause an error to demonstrate what happens.
router.get("/", utilities.handleErrors(errorController.buildError));

module.exports = router;