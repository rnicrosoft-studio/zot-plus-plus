/*
 * @Author       : rnicrosoft
 * @Created      : 2021-09-25 00:44:42
 * @LastEditor   : rnicrosoft
 * 
 * Copyright (c) 2021 rnicrosoft
 * Confidential and proprietary.  All rights reserved.
 */
Zotero.ZotPlusPlus = new function () {
    
    var _initialized = false;

    /**
     * Initiate ZotPlusPlus
     * @return {void}
     */
    this.init = async function () {
        Zotero.log("ZotPlusPlus: init");
        await Zotero.Schema.schemaUpdatePromise;
        // only do this stuff for the first run
        if (!_initialized) {
        }

        var trim = (s) => {
            return s.replace(/^\s*/, '').replace(/\s*$/, '')
        }

        // returns undefined/null if no matching pref
        var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
        var tagFilterStringPref = unescape(trim(prefManager.getCharPref("extensions.zotero.zot-plus-plus.tags-string") || ""));
        Zotero.log("tag filter string: " + tagFilterStringPref);

        var specialTagsMapping = {};
        if (tagFilterStringPref.startsWith("{") && tagFilterStringPref.endsWith("}")) {
            Zotero.log("parsing settings as JSON")
            specialTagsMapping = JSON.parse(tagFilterStringPref)
        } else {
            Zotero.log("parsing settings as comma-delimited string")
            var tagFilterStringSplit = tagFilterStringPref.split(",")
            for (var i = 0; i < tagFilterStringSplit.length; ++i) {
                let tagFilterString = trim(tagFilterStringSplit[i])
                if (tagFilterString.length == 0) {
                    continue;
                }
                specialTagsMapping[tagFilterString] = true;
            }
        }

        Zotero.log("Loaded special tags: " + JSON.stringify(specialTagsMapping));
        // ref better-bibtex.ts:264 $patch$ technique
        var original_getCellText = Zotero.ItemTreeView.prototype.getCellText;
        Zotero.ItemTreeView.prototype.getCellText = function (row, col) {
            // row: number
            // col: object
            if (col.id !== 'zotero-items-column-extra') {
                return original_getCellText.apply(this, arguments)
            }
            // prepend tags to title column
            const item = this.getRow(row).ref
            if (item.isNote() || item.isAttachment() || (item.isAnnotation != null ? item.isAnnotation() : null)) {
                return ''
            }
            const tags = Object.keys(specialTagsMapping).map((tagItem) => {
                for (const iterator of item._tags) {
                    if (iterator.tag == tagItem) {
                        return specialTagsMapping[tagItem]
                    }
                }
                return undefined
            }).filter(ele => ele)
            // tags.push(original_getCellText.apply(this, arguments))
            return tags.join(" ")
        }

        _initialized = true;
    };
};