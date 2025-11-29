const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    pageStyle: 'login',
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver register view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    pageStyle: 'login',
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      pageStyle: 'login',
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      pageStyle: 'login',
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      pageStyle: 'login',
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      }
      else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        pageStyle: 'login',
        errors: null,
        account_email,
      })
    }
  }
  catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/manage", {
    title: "Account",
    pageStyle: null,
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver update account information view
* *************************************** */
async function buildUpdate(req, res, next) {
  const nav = await utilities.getNav();
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_type,
  } = await accountModel.getAccountById(req.params.account_id)
  res.render("account/update", {
    title: `Account Information for ${account_firstname} ${account_lastname}`,
    pageStyle: null,
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email,
    account_type,
    initial: true
  })
}

/* ****************************************
 *  Process update request
 * ************************************ */
async function updateInfo(req, res) {
  let nav = await utilities.getNav()
  const { account_id, submit, account_password } = req.body;
  const accountData = await accountModel.getAccountById(account_id);
  const account_firstname = req.body.account_firstname || accountData.account_firstname
  const account_lastname = req.body.account_lastname || accountData.account_lastname
  const account_email = req.body.account_email || accountData.account_email

  const messages = {sucess: "An unknown success has occured.", failure: "An unknown error has occured."};
  let updateResult = false;

  if(submit == 'Change Password') {
    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    }
    catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the password update.')
      res.status(500).render("account/update", {
        title: `Account Information for ${account_firstname} ${account_lastname}`,
        pageStyle: null,
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
        account_id,
      })
      return;
    }

    [messages.sucess, messages.failure] = [
      'Your password has been successfully updated',
      'Sorry, there was an error updating your password'
    ];

    updateResult = await accountModel.updateAccountPassword(
      account_id,
      hashedPassword
    );
  }
  else if(submit == 'Update Details') {
    [messages.sucess, messages.failure] = [
      'Your information has been successfully updated',
      'Sorry, there was an error updating your information'
    ]

    updateResult = await accountModel.updateAccountData(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );
  }

  if (updateResult) {
    req.flash("notice", messages.sucess)
    res.render("account/manage", {
      title: "Account",
      pageStyle: null,
      nav,
      errors: null,
    })
  }
  else {
    req.flash("notice", messages.failure)
    res.status(501).render("account/update", {
      title: `Account Information for ${account_firstname} ${account_lastname}`,
      pageStyle: null,
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
  }
}

/* ****************************************
 *  Notify of logout and send to home.
 * ************************************ */
async function logout(req, res) {
  res.clearCookie("jwt");
  req.flash("notice", "You have been successfully logged out!");
  return res.redirect("/");
}

module.exports = { 
  buildLogin,
  buildRegister, 
  registerAccount,
  accountLogin,
  buildManagement,
  buildUpdate,
  updateInfo,
  logout,
}