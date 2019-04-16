// respect existing onerror handlers
var _onerror_original = window.onerror;

// configuration from script tag
var script = document.currentScript;
var action = {};
var config = {};

action.post_url = script.getAttribute("data-post-url") || null;
action.callback = script.getAttribute("data-callback") || null;
//action.email_to = script.getAttribute("data-email-to") || null;
config.continuous = script.getAttribute("data-continuous") != null;
config.prevent_default = script.getAttribute("data-prevent-default") != null;

// console.log("config", config);

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
  action.callback && window[action.callback] && window[action.callback](e);
  //action.email_to && _action_email_to(action.email_to, e);

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
    "line": line,
    "column": column,
    "useragent": navigator.userAgent,
  };
  if (error) {
    if (error.stack) e.stack = error.stack;
    if (error.fileName) e.file = error.fileName;
    if (error.message) e.message = error.message;
    if (error.description) e.message = error.description;
  }
  return e;
}

// handler to post to an API url
var _action_post_url = function(url, e) {
  console.log("_action_post_url", url, e);
  var http = new XMLHttpRequest();
  var param_pairs = [];
  for (var k in e) {
    param_pairs.push(k + "=" + encodeURIComponent(e[k]));
  }
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  
  http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
          console.log("catch-all-errors successful post:", http.responseText);
      } else if (http.readyState == 4) {
        console.log("catch-all-errors:", http.status, http.responseText);
      }
  }
  
  http.send(param_pairs.join("&"));
}

// TODO: handler to prompt the user to send an email
// PRs implementing this are welcome!
//
// Design:
//  * Pop up modal asking user to send a mail to the developer.
//  * The "Send" button should be a href with mailto:
//  * The mailto: address should be email_address
//  * The mailto: link should have &subject=Traceback
//  * The mailto: link should have &body=JSON.serialize(e)
// User should be able to customise modal look and contents
// with CSS and/or configs
//
// https://news.ycombinator.com/hn.js
// function nu(tag, attrs, text) { var e = document.createElement(tag); for(var a in attrs) { e.setAttribute(a, attrs[a]); }; e.innerHTML = text || ""; return e; }
// function chkurl(s) { return document.location.href.indexOf(s) != -1; }
// function ins(where, el) { return where.parentNode.insertBefore(el, where.nextSibling); };
//
/*var _action_email_to = function(email_address, e) {
  console.log("_action_email_to", email_address, e);
}*/

// TODO: handler to post to Google Analytics API
//  ga('send', 'event', 'window.onerror', message, navigator.userAgent);

