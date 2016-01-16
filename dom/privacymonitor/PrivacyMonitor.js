const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;
const Cc = Components.classes;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

const manifestURL = Services.io.newURI("app://test-app.gaiamobile.org/manifest.webapp", null, null);

XPCOMUtils.defineLazyServiceGetter(this, "cpmm",
                                   "@mozilla.org/childprocessmessagemanager;1",
                                   "nsIMessageSender");

XPCOMUtils.defineLazyGetter(this, "messenger", function() {
  return Cc["@mozilla.org/system-message-internal;1"]
           .getService(Ci.nsISystemMessagesInternal);
});

function debug(str) {
  dump("-*- Permission WebIDL: " + str + "\n");
}

function PrivacyMonitor() {
  //this.wrappedJSObject = this;
}

PrivacyMonitor.prototype = {
  classID:          Components.ID("{b4ab68fb-4e4c-40db-b091-be66badfe568}"),
  contractID:       "@mozilla.org/privacy-monitor;1",

  QueryInterface: XPCOMUtils.generateQI([Ci.nsIPrivacyMonitor, Ci.PrivacyMonitor, Ci.nsISupports]),

  classInfo: XPCOMUtils.generateCI({classID: Components.ID("{b4ab68fb-4e4c-40db-b091-be66badfe568}"),
                                    contractID: "@mozilla.org/privacy-monitor;1",
                                    interfaces: [Ci.nsIPrivacyMonitor, Ci.PrivacyMonitor, Ci.nsISupports],
                                    flags: Ci.nsIClassInfo.DOM_OBJECT}),

  notifyListener: function(appName, permission) {
    debug("Sending Async Message");

    let message = {name: appName, permission: permission};
    messenger.sendMessage("privacy-request-notification", message, null, manifestURL);
  },

  getAppName: function(request) {
    let app = Cc["@mozilla.org/AppsService;1"].getService(Ci.nsIAppsService).getAppByLocalId(request.principal.appId);
    debug("manifest URL: " + app.manifestURL);
    return app.name;
  }
};

this.NSGetFactory = XPCOMUtils.generateNSGetFactory([PrivacyMonitor]);
