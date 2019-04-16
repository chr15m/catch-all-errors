// respect existing onerror handlers
var _onerror_original = window.onerror;

// configuration from script tag
var script = document.currentScript;
var action = {};
var config = {};

action.post_url = script.getAttribute("data-post-url") || null;
action.callback = script.getAttribute("data-callback") || null;
action.email_to = script.getAttribute("data-email-to") || null;
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
  action.callback && window[action.callback] && window[action.callback](e);
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

// handler to pop up modal asking user to send a mail to the developer
// User can customise modal look and contents with CSS
//
// https://news.ycombinator.com/hn.js
function nu(tag, attrs, text) { var e = document.createElement(tag); for(var a in attrs) { e.setAttribute(a, attrs[a]); }; e.innerHTML = text || ""; return e; }

var _action_email_to = function(email_address, e) {
  console.log("_action_email_to", email_address, e);
  var modal = nu("div", {"class": "catch-all-errors-modal"});
  var modal_content = nu("div", {}, "Oops an error occured. Email this to the developers?<br/>");
  var cancel = nu("a", {"href": "#"}, "Cancel");
  var button = nu("a", {
    "href": "mailto:" + email_address +
    "?subject=" + encodeURIComponent("JavaScript error from " + e.url) +
    "&body=" + encodeURIComponent("Hi, just letting you know I saw the following error:\n\n" + JSON.stringify(e, null, 2) + "\n")},
    "Send");
  document.body.appendChild(modal);
  modal.appendChild(modal_content);
  modal_content.appendChild(cancel);
  modal_content.appendChild(button);
  function _removemodal() {
    document.body.removeChild(modal);
  }
  modal.style = "position: fixed; z-index: 1, left: 0; top: 0; width: 100%; height: 100%; overflow: none; background-color: rgba(0,0,0,0.4); margin: auto auto;";
  modal_content.style = "margin: 1em auto; width: 200px; text-align: center; padding: 2em; background-color: white; border-radius: 3px;";
  cancel.style = button.style = "margin: 2em 1em 0em 1em; display: inline-block;";
  cancel.onclick = function(ev) { ev.preventDefault(); _removemodal(); };
  button.onclick = function(ev) { setTimeout(function() {document.body.removeChild(modal);}, 1); };
}

// TODO: handler to post to Google Analytics API
//  ga('send', 'event', 'window.onerror', message, navigator.userAgent);

