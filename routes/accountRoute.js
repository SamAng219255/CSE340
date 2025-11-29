// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const accValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.get("/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);

router.get("/update/:account_id",
  utilities.checkAllowedLogin({minimumLevel: 'Admin', idMatchesParam: true, mode: 'or'}),
  utilities.handleErrors(accountController.buildUpdate)
);

router.get("/logout", utilities.handleErrors(accountController.logout));

// Process the registration data
router.post(
  "/register",
  accValidate.registationRules(),
  accValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login data
router.post(
  "/login",
  accValidate.loginRules(),
  accValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.post("/update/",
  accValidate.updateRules(),
  accValidate.checkUpdateData,
  utilities.checkAllowedLogin({minimumLevel: 'Admin', idMatchesPost: true, mode: 'or'}),
  utilities.handleErrors(accountController.updateInfo)
);

module.exports = router;