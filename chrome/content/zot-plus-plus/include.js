/*
 * @Author       : rnicrosoft
 * @Created      : 2021-09-25 00:47:20
 * 
 * Copyright (c) 2021 rnicrosoft
 * Confidential and proprietary.  All rights reserved.
 */
// Only create main object once
if (!Zotero.ZotPlusPlus) {
    var zotplusplusLoader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
        .getService(Components.interfaces.mozIJSSubScriptLoader);
    var scripts = ['zot-plus-plus', 'overlay'];
    scripts.forEach(s => zotplusplusLoader.loadSubScript('chrome://zot-plus-plus/content/' + s + '.js'));
}

window.addEventListener('load', function (e) {
    Zotero.ZotPlusPlus.init();
    if (window.ZoteroPane) {
    }
}, false);