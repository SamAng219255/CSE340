const invModel = require("../models/inventory-model")
const comModel = require("../models/comment-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle view HTML
* ************************************ */
Util.buildVehicleDescription = async function(data){
  return `
    <img class="vehicle-img" src="${data.inv_image}" alt="Image of a ${data.inv_make} ${data.inv_model} car.">
    <div class="vehicle-desc">
      <h2>${data.inv_make} ${data.inv_model} Details</h2>
      <ul>
        <li><b>Make:</b> ${data.inv_make}</li>
        <li><b>Model:</b> ${data.inv_model}</li>
        <li><b>Year:</b> ${data.inv_year}</li>
        <li><b>Price:</b> $${parseFloat(data.inv_price).toLocaleString('en-US')}</li>
        <li><b>Miles:</b> ${parseFloat(data.inv_miles).toLocaleString('en-US')}</li>
        <li><b>Color:</b> ${data.inv_color}</li>
      </ul>
      <p><b>Description</b></p>
      <p>${data.inv_description}</p>
    </div>
  `;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* **************************************
* Build option tags for the list of classifications.
* ************************************ */
Util.getClassificationOptions = async function(selectedOption) {
  const data = await invModel.getClassifications();
  return '<option value="">———</option>' + data.rows.reduce((acc, row) => acc + 
    `<option value="${row.classification_id}"${parseInt(selectedOption) === parseInt(row.classification_id) ? ' selected' : ''}>${row.classification_name}</option>`,
  '');
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  }
  else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

Util.checkLoginEmployee = (req, res, next) => {
  if (res.locals.loggedin && ['Employee', 'Admin'].includes(res.locals.accountData.account_type)) {
    next()
  }
  else {
    req.flash("notice", "Invalid Permissions.")
    return res.redirect("/account/login")
  }
}

Util.checkAllowedLogin = ({minimumLevel, maximumLevel, idIs, idMatchesParam = false, idMatchesPost = false, idMatches = false, mode = 'or'}) => {
  const accountLevels = ['Client', 'Employee', 'Admin'];
  const minimumLevelInt = accountLevels.indexOf(minimumLevel);
  const maximumLevelInt = accountLevels.indexOf(maximumLevel);
  return async (req, res, next) => {
    if(res.locals.loggedin) {
      const accountData = res.locals.accountData || {};
      const accountLevel = accountLevels.indexOf(accountData.account_type);
      const checks = [];
      if(minimumLevel !== undefined)  checks.push(accountLevel >= minimumLevelInt);
      if(maximumLevel !== undefined)  checks.push(accountLevel <= maximumLevelInt);
      if(idIs !== undefined)          checks.push(accountData.account_id == idIs);
      if(idMatchesParam)              checks.push(accountData.account_id == req.params.account_id);
      if(idMatchesPost)               checks.push(accountData.account_id == req.body.account_id);
      if(idMatches)                   checks.push(await idMatches(accountData.account_id, req.body));
      if (mode == 'or' ? checks.some(x => x) : checks.every(x => x)) {
        next()
        return
      }
    }
    req.flash("notice", "Invalid Permissions.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check if comment owner matches given account id for login check
 *  If comment_id is not provided, always passes
 * ************************************ */
Util.matchesComment = async (account_id, body) => {
  if(body.comment_id === undefined)
    return true;

  const commentData = await comModel.getCommentById(body.comment_id);
  return account_id == commentData.account_id;
}

/* ****************************************
 *  Build the comments section html
 * ************************************ */
Util.buildCommentsSection = (commentsData, inv_id, {loggedin = 0, accountData = {}, postStickyText = '', editStickyText = '', editStickyId = 0} = {}) => {
  let commentsStr = '<section class="comments"><h2>Reviews</h2><ul class="comments-list">';
  commentsStr += commentsData.map(comment => {
    const canManipulate = loggedin && 
      (accountData.account_type == 'Admin' || accountData.account_id == comment.account_id);
    const buttons = `
      <div class="comment-buttons">
        <button class="comment-delete">delete</button> | 
        <button class="comment-edit">edit</button>
      </div>`;
    return `<li class="comments-comment" data-comment-id="${comment.comment_id}">
      <span class="comment-body">${comment.comment_body}</span>
      <span class="comment-user">${comment.account_name}</span>
      ${canManipulate ? buttons : ''}
    </li>`;
  }).join('');
  commentsStr += '</ul>'

  if(loggedin) {
    commentsStr += `
      <form class="comment-add" action="/inv/detail/${inv_id}" method="post">
        <label>
          Got something to say? Add your own review and let us know how you liked it:
          <textarea name="comment_body" required>${postStickyText}</textarea>
        </label>
        <input type="submit" name="action" value="Post Review">
      </form>`;
  }
  else {
    commentsStr += `
      <div>
        <span>Got something to say? <a href="/account/login">Log in</a> to add your own review and let us know how you liked it.</span>
      </div>`;
  }

  commentsStr += '</section>';

  const deleteDialog = `
    <dialog id="comment-confirm">
      <p>Are you sure you want to delete <span id="comment-confirm-user"></span> review?</p>
      <p id="comment-confirm-body"></p>
      <div>
        <button id="comment-confirm-cancel">Cancel</button>
        <form action="/inv/detail/${inv_id}" method="post">
          <input type="hidden" name="comment_id" id="comment-confirm-id">
          <input type="submit" name="action" value="Delete Review">
        </form>
      </div>
    </dialog>
  `;

  const editDialog = `
    <dialog id="comment-edit"${editStickyText ? ' class="open"' : ''}>
      <form action="/inv/detail/${inv_id}" method="post" class="requires-update">
        <label>
          Edit review:
          <textarea id="comment-edit-body" name="comment_body" required>${editStickyText}</textarea>
        </label>
        <input type="hidden" name="comment_id" id="comment-edit-id"${editStickyText ? ` value="${editStickyId}"` : ''}>
        <div>
          <button id="comment-edit-cancel">Cancel</button>
          <input type="submit" name="action" value="Edit Review">
        </div>
      </form>
    </dialog>
  `;

  return commentsStr + (loggedin ? deleteDialog + editDialog : '');
}



module.exports = Util