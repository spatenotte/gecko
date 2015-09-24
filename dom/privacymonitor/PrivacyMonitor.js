const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;
const Cc = Components.classes;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

function debug2(str) {
  dump("-*- Permission WebIDL: " + str + "\n");
}

function PrivacyMonitor() {
  this.wrappedJSObject = this;
}

function writeToIndexedDB(name, permission, date) {
  debug2("Entered indexedDB");
  let request = indexedDB.open("permissionLog", 1);
  var db;
  
  request.onerror = function(event) {
    debug2("error opening DB ");
  };
 
  request.onsuccess = function(event) {
    db = event.target.result;
    debug2(typeof(db));
    debug2("success opening DB");
    var write = db.transaction(["entries"], "readwrite")
              .objectStore("entries")
              .add({ name: name, permission: permission, date: date});

    write.onerror = function(event) {
      debug2("error writing to DB");
    };
 
    write.onsuccess = function(event) {
      debug2("success writing to DB");
    };
  };

  request.onupgradeneeded = function(event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("entries", { autoIncrement : true });
    objectStore.createIndex("name", "name", { unique: false });
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
    debug2("Entered WebIDL");
    let app = Cc["@mozilla.org/AppsService;1"].getService(Ci.nsIAppsService).getAppByLocalId(appID);

    for (let i in typesInfo) {
      debug2("Prompting for: " + typesInfo[i].permission);
      writeToIndexedDB(app.name, typesInfo[i].permission, new Date().toISOString());
    }
    debug2("From app: " + JSON.stringify(app.name));
    debug2("At: " + new Date().toISOString());
  },

  readIndexedDB: function readIndexedDB() {
    let request = indexedDB.open("permissionLog", 1);

    request.onerror = function(event) {
      debug2("error opening DB ");
    };

    request.onsuccess = function(event) {
      db = event.target.result;
      return db;
    };
  }
};

this.NSGetFactory = XPCOMUtils.generateNSGetFactory([PrivacyMonitor]);