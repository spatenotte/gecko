/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/* static functions */
const DEBUG = true;

function debug(aStr) {
  DEBUG && dump("PrivacyMonitorService: " + aStr + "\n");
}

const { classes: Cc, interfaces: Ci, utils: Cu, results: Cr } = Components;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

const manifestURI = Services.io.newURI("app://test-app.gaiamobile.org/manifest.webapp", null, null);
const pageURI = Services.io.newURI("app://test-app.gaiamobile.org/index.html", null, null);

this.EXPORTED_SYMBOLS = ["PrivacyMonitorService"];

XPCOMUtils.defineLazyServiceGetter(this, "ppmm",
                                   "@mozilla.org/parentprocessmessagemanager;1",
                                   "nsIMessageListenerManager");

XPCOMUtils.defineLazyGetter(this, "messenger", function() {
  return Cc["@mozilla.org/system-message-internal;1"]
           .getService(Ci.nsISystemMessagesInternal);
});

this.PrivacyMonitorService = {

  init: function init() {
    debug("init()");

    // Add the messages to be listened to.
    this._messages = ["PrivacyMonitor::Notify"];
    this._messages.forEach(function addMessage(msgName) {
      ppmm.addMessageListener(msgName, this);
    }.bind(this));
  },

  receiveMessage: function receiveMessage(aMessage) {
    switch (aMessage.name) {
      case "PrivacyMonitor::Notify":
      	this._fireSystemMessage(aMessage.data);
        break;

      default:
        throw Components.results.NS_ERROR_NOT_IMPLEMENTED;
        break;
    }
  },

  _fireSystemMessage: function _fireSystemMessage(aMessage) {
    messenger.broadcastMessage("privacy-request-notification", aMessage);
  },

  uninit: function uninit() {
    debug("uninit()");

    this._messages.forEach(function(aMsgName) {
      ppmm.removeMessageListener(aMsgName, this);
    }.bind(this));
    ppmm = null;
  }
}

PrivacyMonitorService.init();
