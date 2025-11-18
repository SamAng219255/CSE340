const utilities = require("../utilities/")

const errCont = {}

/* ***************************
 *  Cause an error.
 * ************************** */
errCont.buildError = async function (req, res, next) {
  throw new Error("This is an intentional error.");
  let nav = await utilities.getNav();
  res.render("/", {
    title: "Error",
    pageStyle: null,
    nav,
    errors: null,
  })
}

module.exports = errCont