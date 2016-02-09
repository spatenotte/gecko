const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;
const Cc = Components.classes;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

const manifestURL = Services.io.newURI("app://test-app.gaiamobile.org/manifest.webapp", null, null);
const pageURL = Services.io.newURI("app://test-app.gaiamobile.org/index.html", null, null);

var cpmm = Cc["@mozilla.org/childprocessmessagemanager;1"]
                   .getService(Ci.nsISyncMessageSender);

var contentWindow = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
                   .getService(Components.interfaces.nsIWindowWatcher);

var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                     .getService(Components.interfaces.nsIWindowMediator);

function debug(str) {
  dump("-*- PrivacyMonitor: " + str + "\n");
}

function PrivacyMonitor() {
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
    let appName = this.getAppName();
    let date = Date.now();

    debug(appName + " requested " + JSON.stringify(permission) + " permission at: " + date.toString());

    let message = {name: appName, permission: permission, date: date};
    cpmm.sendAsyncMessage("PrivacyMonitor::Notify", message);
  },

  getAppName: function() {
    let principal;
    if(contentWindow.activeWindow == null) {
      let activeWindow = windowMediator.getMostRecentWindow(null);
      principal = activeWindow.document.nodePrincipal;
    }
    else {
      principal = contentWindow.activeWindow.document.nodePrincipal;
    }
    let app = Cc["@mozilla.org/AppsService;1"].getService(Ci.nsIAppsService).getAppByLocalId(principal.appId);
    return app.name;
  }
};

this.NSGetFactory = XPCOMUtils.generateNSGetFactory([PrivacyMonitor]);
