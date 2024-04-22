// Ref: https://github.com/zotero/make-it-red/blob/main/src-1.2/bootstrap.js

if (typeof Zotero == 'undefined') {
    var Zotero;
}
// var MakeItRed;

let mainWindowListener;

function log(msg) {
    Zotero.debug("[Zot Plus Plus] " + msg);
}

// In Zotero 6, bootstrap methods are called before Zotero is initialized, and using include.js
// to get the Zotero XPCOM service would risk breaking Zotero startup. Instead, wait for the main
// Zotero window to open and get the Zotero object from there.
//
// In Zotero 7, bootstrap methods are not called until Zotero is initialized, and the 'Zotero' is
// automatically made available.
async function waitForZotero() {
    if (typeof Zotero != 'undefined') {
        await Zotero.initializationPromise;
        return;
    }

    var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
    var windows = Services.wm.getEnumerator('navigator:browser');
    var found = false;
    while (windows.hasMoreElements()) {
        let win = windows.getNext();
        if (win.Zotero) {
            Zotero = win.Zotero;
            found = true;
            break;
        }
    }
    if (!found) {
        await new Promise((resolve) => {
            var listener = {
                onOpenWindow: function (aWindow) {
                    // Wait for the window to finish loading
                    let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor)
                        .getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
                    domWindow.addEventListener("load", function () {
                        domWindow.removeEventListener("load", arguments.callee, false);
                        if (domWindow.Zotero) {
                            Services.wm.removeListener(listener);
                            Zotero = domWindow.Zotero;
                            resolve();
                        }
                    }, false);
                }
            };
            Services.wm.addListener(listener);
        });
    }
    await Zotero.initializationPromise;
}


async function install() {
    await waitForZotero();

    log("[bootstrap] Installed");
}
function uninstall() {
    // `Zotero` object isn't available in `uninstall()` in Zotero 6, so log manually
    if (typeof Zotero == 'undefined') {
        dump("[Zot Plus Plus][bootstrap] Uninstalled\n\n");
        return;
    }

    log("[bootstrap] Uninstalled");
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

// Loads default preferences from prefs.js in Zotero 6
function setDefaultPrefs(rootURI) {
    var branch = Services.prefs.getDefaultBranch("");
    var obj = {
        pref(pref, value) {
            switch (typeof value) {
                case 'boolean':
                    branch.setBoolPref(pref, value);
                    break;
                case 'string':
                    branch.setStringPref(pref, value);
                    break;
                case 'number':
                    branch.setIntPref(pref, value);
                    break;
                default:
                    Zotero.logError(`Invalid type '${typeof (value)}' for pref '${pref}'`);
            }
        }
    };
    Services.scriptloader.loadSubScript(rootURI + "prefs.js", obj);
}

// Adds main window open/close listeners in Zotero 6
function listenForMainWindowEvents(rootURI) {
    mainWindowListener = {
        onOpenWindow: function (aWindow) {
            let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor)
                .getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
            async function onload() {
                domWindow.removeEventListener("load", onload, false);
                log("onOpenWindow-onload: " + domWindow.location.href)
                // chrome://zotero/content/progressWindow.xul
                if (domWindow.location.href === "chrome://zotero/content/standalone/standalone.xul") {
                    Zotero.ZotPlusPlus.onMainWindowLoad({ window: domWindow });
                }
                if (domWindow.location.href === "chrome://zotero/content/preferences/preferences.xul") {
                    Zotero.ZotPlusPlus.onPrefWindowLoad({ window: domWindow, rootURI: rootURI });
                }
            }
            domWindow.addEventListener("load", onload, false);
        },
        onCloseWindow: async function (aWindow) {
            let domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor)
                .getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
            if (domWindow.location.href === "chrome://zotero/content/standalone/standalone.xul") {
                Zotero.ZotPlusPlus.onMainWindowUnload({ window: domWindow });
            }
            if (domWindow.location.href === "chrome://zotero/content/preferences/preferences.xul") {
                Zotero.ZotPlusPlus.onPrefWindowUnload({ window: domWindow });
            }
        },
    };
    Services.wm.addListener(mainWindowListener);
}
function removeMainWindowListener() {
    if (mainWindowListener) {
        Services.wm.removeListener(mainWindowListener);
    }
}

async function startup({ id, version, resourceURI, rootURI = resourceURI.spec }) {
    await waitForZotero();

    log("[bootstrap] Starting");

    // 'Services' may not be available in Zotero 6
    if (typeof Services == 'undefined') {
        var { Services } = ChromeUtils.import("resource://gre/modules/Services.jsm");
    }

    if (Zotero.platformMajorVersion < 102) {
        // Read prefs from prefs.js in Zotero 6
        setDefaultPrefs(rootURI);
    }

    Services.scriptloader.loadSubScript(rootURI + '/chrome/content/zot-plus-plus/include.js', { id, version, rootURI });
    Zotero.ZotPlusPlus.Logger.trace("rootURI", rootURI);

    // Zotero.PreferencePanes is not available in Zotero 6
    // Zotero.PreferencePanes.register({
    //     pluginID: id,
    //     label: 'ZotCard',
    //     image: 'chrome://zotcard/content/images/zotcard.png',
    //     src: rootURI + 'chrome/content/preferences/preferences.xhtml',
    //     scripts: [rootURI + 'chrome/content/preferences/preferences.js'],
    //     helpURL: 'https://github.com/018/zotcard',
    // });

    Services.scriptloader.loadSubScript(rootURI + 'zot-plus-plus.js');
    Zotero.ZotPlusPlus.Logger.log("loadSubScript zot-plus-plus.js");
    
    Zotero.ZotPlusPlus.init({ id, version, rootURI });
    Zotero.ZotPlusPlus.addToAllWindows();

    if (Zotero.platformMajorVersion < 102) {
        // Listen for window load/unload events in Zotero 6, since onMainWindowLoad/Unload don't
        // get called (like https://github.com/zotero/zotero/blob/cdacc42fd2071967bc76e6781542d03a3659cf6a/chrome/content/zotero/xpcom/plugins.js#L82)
        listenForMainWindowEvents(rootURI);
    }

    await Zotero.ZotPlusPlus.main();
}
function shutdown() {
    log("[bootstrap] Shutting down");

    if (Zotero.platformMajorVersion < 102) {
        removeMainWindowListener();
    }

    Zotero.ZotPlusPlus.removeFromAllWindows();
    Zotero.ZotPlusPlus = undefined;
}