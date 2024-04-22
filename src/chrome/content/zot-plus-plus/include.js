/*
 * @Author       : rnicrosoft
 * @Created      : 2021-09-25 00:47:20
 * 
 * Copyright (c) 2021 rnicrosoft
 * Confidential and proprietary.  All rights reserved.
 */

Services.scriptloader.loadSubScript(rootURI + 'chrome/content/modules/moment.min.js');

Services.scriptloader.loadSubScript(rootURI + 'chrome/content/modules/zotpp-logger.js');
Zotero.ZotPlusPlus.Logger.init();
Zotero.ZotPlusPlus.Logger.log("loadSubScript modules/zotpp-logger.js");

Services.scriptloader.loadSubScript(rootURI + 'chrome/content/modules/zotpp-prefs.js');
Zotero.ZotPlusPlus.Prefs.init( "zot-plus-plus" );
Zotero.ZotPlusPlus.Logger.log("loadSubScript modules/zotpp-prefs.js");

Services.scriptloader.loadSubScript(rootURI + 'chrome/content/modules/zotpp-doms.js');
Zotero.ZotPlusPlus.Doms.init();
Zotero.ZotPlusPlus.Logger.log("loadSubScript modules/zotpp-doms.js");

Services.scriptloader.loadSubScript(rootURI + 'chrome/content/modules/zotpp-events.js');
Zotero.ZotPlusPlus.Events.init();
Zotero.ZotPlusPlus.Logger.log("loadSubScript modules/zotpp-events.js");