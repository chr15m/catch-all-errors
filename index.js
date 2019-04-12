// https://news.ycombinator.com/hn.js
function nu(tag, attrs, text) { var e = document.createElement(tag); for(var a in attrs) { e.setAttribute(a, attrs[a]); }; e.innerHTML = text || ""; return e; }
function chkurl(s) { return document.location.href.indexOf(s) != -1; }
function ins(where, el) { return where.parentNode.insertBefore(el, where.nextSibling); };

// respect existing onerror handlers
var _onerror_original = window.onerror;

// configuration from script tag
var script = document.currentScript;
var action = {};
var config = {};

action.post_url = script.getAttribute("data-post-url") || null;
action.email_to = script.getAttribute("data-email-to") || null;
config.continuous = script.getAttribute("data-continous") != null;
config.prevent_default = script.getAttribute("data-prevent-default") != null;

console.log("config", config);

// install our new error handler
window.onerror = function(message, url, line, column, error) {
  // unset onerror to prevent loops and spamming
  var _onerror = window.onerror;
  window.onerror = null;

  // now deal with the error
  var e = _extract_error.apply(null, arguments);
  console.log("extracted error:", e);

  // if user has configured API post
  action.post_url && _action_post_url(action.post_url, e);
  action.email_to && _action_email_to(action.email_to, e);

  // re-install this error handler again if continuous mode
  if (config.continuous) {
    window.onerror = _onerror;
  }

  // true if normal error propagation should be suppressed
  // (i.e. normally console.error is logged by the browser)
  return config.prevent_default;
};

var _extract_error = function(message, url, line, column, error) {
  console.log("onerror", arguments);
  var e = {
    "message": message,
    "url": url,
    "pos": [line, column],
    "useragent": navigator.userAgent,
  };
  if (error) {
    if (error.stack) e.stack = error.stack;
    if (error.fileName) e.file = error.fileName;
    if (error.message) e.message = error.message;
    if (error.description) e.message = error.description;
  }
  console.log(e);
  alert(JSON.stringify(e, null, 2));
  return e;
}

// handler to prompt the user to send an email
var _action_email_to = function(email_address, e) {
  console.log("_action_email_to", email_address, e);
}

// handler to post to an API url
var _action_post_url = function(url, e) {
  console.log("_action_post_url", url, e);
}

// TODO: handler to post to Google Analytics API
//  ga('send', 'event', 'window.onerror', message, navigator.userAgent);

