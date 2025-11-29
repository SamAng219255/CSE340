const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email);
      if(emailExists) {
        throw new Error("Email already exists. Please log in or use different email.")
      }
    }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      pageStyle: "login",
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
*  Login Data Validation Rules
* ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("Invalid email or password.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email);
      if(!emailExists) {
        throw new Error("Invalid email or password.")
      }
    }),

    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Invalid email or password."),
  ]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      pageStyle: "login",
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
*  Update Data Validation Rules
* ********************************* */
validate.updateRules = () => {
  return [
    body("submit")
      .unescape()
      .isIn(["Update Details", "Change Password"]),

    // id is required and must be a number
    body("account_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt()
      .withMessage("Invalid account id. Please return to account management page and try again."),

    // firstname is required and must be string
    body("account_firstname")
      .if(body("submit").unescape().equals('Update Details'))
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .if(body("submit").unescape().equals('Update Details'))
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .if(body("submit").unescape().equals('Update Details'))
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, {req}) => {
        const currentEmail = (await accountModel.getAccountById(req.body.account_id)).account_email;
        if(account_email != currentEmail) {
          const emailExists = await accountModel.checkExistingEmail(account_email);
          if(emailExists) {
            throw new Error("Email already exists. Please log in or use different email.")
          }
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .if(body("submit").unescape().equals('Change Password'))
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const account_id = req.body.account_id;
  const accountData = await accountModel.getAccountById(account_id);
  const account_firstname = req.body.account_firstname || accountData.account_firstname
  const account_lastname = req.body.account_lastname || accountData.account_lastname
  const account_email = req.body.account_email || accountData.account_email
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      errors,
      pageStyle: null,
      title: `Account Information for ${accountData.account_firstname} ${accountData.account_lastname}`,
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
    return
  }
  next()
}

module.exports = validate