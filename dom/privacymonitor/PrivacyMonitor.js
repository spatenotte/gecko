const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;
const Cc = Components.classes;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

const manifestURL = Services.io.newURI("app://test-app.gaiamobile.org/manifest.webapp", null, null);
//const pageURL = Services.io.newURI("/", null, null);

XPCOMUtils.defineLazyGetter(this, "messenger", function() {
  return Cc["@mozilla.org/system-message-internal;1"]
           .getService(Ci.nsISystemMessagesInternal);
});

var contentWindow = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
                   .getService(Components.interfaces.nsIWindowWatcher);

function debug(str) {
  dump("-*- Permission WebIDL: " + str + "\n");
}

function PrivacyMonitor() {
  //this.wrappedJSObject = this;
}

PrivacyMonitor.prototype = {
  classID:          Components.ID("{b4ab68fb-4e4c-40db-b091-be66badfe568}"),
  contractID:       "@mozilla.org/privacy-monitor;1",

  QueryInterface: XPCOMUtils.generateQI([Ci.PrivacyMonitor, Ci.nsIPrivacyMonitor, Ci.nsISupports, Ci.nsIDOMGlobalPropertyInitializer]),

  classInfo: XPCOMUtils.generateCI({classID: Components.ID("{b4ab68fb-4e4c-40db-b091-be66badfe568}"),
                                    contractID: "@mozilla.org/privacy-monitor;1",
                                    interfaces: [Ci.PrivacyMonitor, Ci.nsIPrivacyMonitor, Ci.nsISupports],
                                    flags: Ci.nsIClassInfo.DOM_OBJECT}),

  notifyListener: function(permission) {
    debug("Sending Async Message");

    //debug("Permission: " + JSON.stringify(permission));

    let appName = this.getAppName();

    let message = {name: appName, permission: permission};
    messenger.broadcastMessage("privacy-request-notification", message);
  },

  getAppName: function() {
    let principal = contentWindow.activeWindow.document.nodePrincipal;
    let app = Cc["@mozilla.org/AppsService;1"].getService(Ci.nsIAppsService).getAppByLocalId(principal.appId);

    debug("App name: " + app.name);
    debug("manifest URL: " + app.manifestURL);
    return app.name;
  }
};

this.NSGetFactory = XPCOMUtils.generateNSGetFactory([PrivacyMonitor]);
