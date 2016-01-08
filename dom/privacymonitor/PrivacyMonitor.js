const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;
const Cc = Components.classes;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

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
    debug("Sending Async Message");

    let message = {name: appName, permission: permission};
    //messenger.sendMessage('privacy-request-notification', message, null, );

    return [];
  },

  getAppName: function(request) {
    let app = Cc["@mozilla.org/AppsService;1"].getService(Ci.nsIAppsService).getAppByLocalId(request.principal.appId);
    debug('manifest URL: ' + app.manifestURL);
    return app.name;
  }
};

this.NSGetFactory = XPCOMUtils.generateNSGetFactory([PrivacyMonitor]);
