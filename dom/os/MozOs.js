"use strict";

// Some shorthands to reference other classes and interfaces in the project
const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

// Essentially the same as a require() call in RequireJS / node.js, although
// the symbols they expose are 'global', so we only call import.
Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/DOMRequestHelper.jsm");
Cu.import("resource://gre/modules/osfile.jsm");
Cu.import("resource://gre/modules/Promise.jsm");

// Constructor has no arguments
function MozOs() { }

MozOs.prototype = {
  // We inherit from DOMRequestIpcHelper which makes it easier to communicate
  // with the code that calls us. We need it for the |createPromise| call later.
  __proto__: DOMRequestIpcHelper.prototype,

  // Same GUID you just saw in the manifest file
  classID: Components.ID("{1c6eabab-d9a1-46ad-b9ad-8a4405ba5f3f}"),

  QueryInterface: XPCOMUtils.generateQI([
    Ci.nsIDOMGlobalPropertyInitializer,
    Ci.nsIObserver,
    Ci.nsISupportsWeakReference
  ]),

  init: function mozOsInit(win) {
    this._window = win;
    this.innerWindowID = win.QueryInterface(Ci.nsIInterfaceRequestor)
                            .getInterface(Ci.nsIDOMWindowUtils)
                            .currentInnerWindowID;
    // Bind the content window to the DOMRequestHelper
    this.initDOMRequestHelper(win, []);

    Services.obs.addObserver(this, "inner-window-destroyed", false);
  },

  uninit: function mozOsUninit() {
    this._window = null;
    this.destroyDOMRequestHelper();
    Services.obs.removeObserver(this, "inner-window-destroyed");
  },

  // Actually implementation time!
  readFile: function mozReadFile(path) {
    // textDecoder can read UTF8
    let decoder = new TextDecoder();

    // We need a new promise here, because OS.File.read returns a 'Chrome' promise
    // It means that it runs with chrome privileges and the caller cannot use it
    // because it does not have that privilege level. We need content promise therefore
    return this.createPromise((res, rej) => {
      // Just simple code, read the file, decode it and resolve the promise
      OS.File.read(path).then(array => {
        res(decoder.decode(array));
      }).catch(err => rej(err));
    });
  }
};

// Expose the new module
this.NSGetFactory = XPCOMUtils.generateNSGetFactory([MozOs]);