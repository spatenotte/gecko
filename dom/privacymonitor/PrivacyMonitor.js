const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;
const Cc = Components.classes;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

function debug(str) {
  dump("-*- Permission WebIDL: " + str + "\n");
}

function PrivacyMonitor() {
  this.wrappedJSObject = this;
}

function writeToIndexedDB(name, permission, date) {
  debug("Entered indexedDB");
  let request = indexedDB.open("permissionLog", 1);
  var db;

  request.onerror = function(event) {
    debug("error opening DB ");
  };

  request.onsuccess = function(event) {
    db = event.target.result;
    debug("success opening DB");
    var write = db.transaction(["entries"], "readwrite")
              .objectStore("entries")
              .add({ name: name, permission: permission, date: date});

    write.onerror = function(event) {
      debug("error writing to DB");
    };

    write.onsuccess = function(event) {
      debug("success writing to DB");
    };

    db.close();
  };

  request.onupgradeneeded = function(event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("entries", { autoIncrement : true });
    objectStore.createIndex("name", "name", { unique: false });
    objectStore.createIndex("permission", "permission", { unique: false });
    objectStore.createIndex("date", "date", { unique: false });
  }
}

PrivacyMonitor.prototype = {
  classID:          Components.ID("{b4ab68fb-4e4c-40db-b091-be66badfe568}"),
  contractID:       "@mozilla.org/privacy-monitor;1",

  QueryInterface: XPCOMUtils.generateQI([Ci.PrivacyMonitor]),

  classInfo: XPCOMUtils.generateCI({classID: Components.ID("{b4ab68fb-4e4c-40db-b091-be66badfe568}"),
                                    contractID: "@mozilla.org/privacy-monitor;1",
                                    interfaces: [Ci.PrivacyMonitor],
                                    flags: Ci.nsIClassInfo.DOM_OBJECT}),

  logPermissionRequest: function logPermissionRequest(appID, typesInfo) {
    // Getting app info
    let app = Cc["@mozilla.org/AppsService;1"].getService(Ci.nsIAppsService).getAppByLocalId(appID);

    for (let i in typesInfo) {
      // Logging to indexedDB for any type of permission asked
      writeToIndexedDB(app.name, typesInfo[i].permission, new Date().toISOString());
    }
    debug("From app: " + JSON.stringify(app.name));
    debug("At: " + new Date().toISOString());
  },

  readIndexedDB: function readIndexedDB() {
    debug("Running readIndexedDB");
    let request = indexedDB.open("permissionLog");
    debug("Trying to open DB");

    request.onblocked = function(event) {
      debug("opening blocked");
      return null;
    };

    request.onabort = function(event) {
      debug("opening aborted");
      return null;
    };

    request.onerror = function(event) {
      debug("error opening DB");
      return null;
    };

    request.onsuccess = function(event) {
      debug("Returning DB object");
      // return db object
      return event.target.result;
    };

    request.onupgradeneeded = function(event) {
      debug("Upgrading or creating DB");
      let db = event.target.result;
      let objectStore = db.createObjectStore("entries", { autoIncrement : true });
      objectStore.createIndex("name", "name", { unique: false });
      objectStore.createIndex("permission", "permission", { unique: false });
      objectStore.createIndex("date", "date", { unique: false });
    }

    debug("Shouldn't get here");
  }
};

this.NSGetFactory = XPCOMUtils.generateNSGetFactory([PrivacyMonitor]);
