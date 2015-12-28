const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;
const Cc = Components.classes;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

XPCOMUtils.defineLazyServiceGetter(this, "cpmm",
                                   "@mozilla.org/childprocessmessagemanager;1",
                                   "nsIMessageSender");

function debug(str) {
  dump("-*- Permission WebIDL: " + str + "\n");
}

function PrivacyMonitor() {
  this.wrappedJSObject = this;
}

PrivacyMonitor.prototype = {
  classID:          Components.ID("{b4ab68fb-4e4c-40db-b091-be66badfe568}"),
  contractID:       "@mozilla.org/privacy-monitor;1",

  QueryInterface: XPCOMUtils.generateQI([Ci.PrivacyMonitor]),

  classInfo: XPCOMUtils.generateCI({classID: Components.ID("{b4ab68fb-4e4c-40db-b091-be66badfe568}"),
                                    contractID: "@mozilla.org/privacy-monitor;1",
                                    interfaces: [Ci.PrivacyMonitor],
                                    flags: Ci.nsIClassInfo.DOM_OBJECT}),

  notifyListener: function(appName, permission) {
    // var name = "onapirequest";
    // Object.defineProperty(this, name, {
    //   get: function get() {
    //     return this.__DOM_IMPL__.getEventHandler(name);
    //   },
    //   set: function set(handler) {
    //     this.__DOM_IMPL__.setEventHandler(name, handler);
    //   }
    // });

    debug("Sending Async Message");

    cpmm.sendAsyncMessage("PrivacyMonitor:APIRequest", {appName: appName, permission: permission});
    return [];
  },

  getAppName: function(request) {
    let app = Cc["@mozilla.org/AppsService;1"].getService(Ci.nsIAppsService).getAppByLocalId(request.principal.appId);
    return app.name;
  }
};

this.NSGetFactory = XPCOMUtils.generateNSGetFactory([PrivacyMonitor]);
