/*
 * @Author       : rnicrosoft
 * @Created      : 2021-09-25 00:44:42
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
        var tagFilterStringPref = decodeURIComponent(trim(prefManager.getCharPref("extensions.zotero.zot-plus-plus.tags-string") || ""));
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
        if (typeof Zotero.ItemTreeView === 'undefined') { // Zotero 6
            // import ItemTree from 'zotero/itemTree';
            const itemTree = require('zotero/itemTree')
            // var original_getColumns = itemTree.prototype.getColumns;
            // itemTree.prototype.getColumns = function () {
            //     const columns = original_getColumns.apply(this, arguments)
            //     columns.splice(columns.findIndex(column => column.dataKey === 'title') + 1, 0, {
            //         dataKey: 'zotplusplus-tags',
            //         label: "Tags",
            //         flex: '1',
            //         zoteroPersist: new Set(['width', 'ordinal', 'hidden', 'sortActive', 'sortDirection']),
            //     })
            //     return columns
            // }

            var original__renderCell = itemTree.prototype._renderCell;
            itemTree.prototype._renderCell = function (index, data, col) {
                // col: object
                if (col.dataKey !== 'extra') {
                    return original__renderCell.apply(this, arguments)
                }
                const item = this.getRow(index).ref
                if (item.isNote() || item.isAttachment() || (item.isAnnotation != null ? item.isAnnotation() : null)) {
                    return original__renderCell.apply(this, arguments)
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
                // return tags.join(" ")

                const icon = document.createElementNS('http://www.w3.org/1999/xhtml', 'span')
                // icon.className = 'icon icon-bg cell-icon'
                icon.innerText = tags.join(" ")

                const cell = document.createElementNS('http://www.w3.org/1999/xhtml', 'span')
                cell.className = `cell ${col.className}`
                cell.append(icon)

                return cell
            }

        } else { // Zotero 5
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
        }

        _initialized = true;
    };
};