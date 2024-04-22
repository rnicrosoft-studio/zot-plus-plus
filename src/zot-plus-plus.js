if (Zotero.platformMajorVersion < 102) {
    Cu.importGlobalProperties(['URL']);
}

if (!Zotero.ZotPlusPlus) Zotero.ZotPlusPlus = {};

Zotero.ZotPlusPlus = Object.assign(Zotero.ZotPlusPlus, {
    id: null,
    version: null,
    rootURI: null,
    _initialized: false,
    addedElementIDs: [],

    init({ id, version, rootURI }) {
        if (this._initialized) return;
        this.id = id;
        this.version = version;
        this.rootURI = rootURI;
        this._initialized = true;
        
        this.registerEvent();
        this.showSpecialTagsColumn();
    },

    // log(msg) {
    //     Zotero.debug("[Zot Plus Plus] " + msg);
    // },
    
    async selectedItemsTag(tag) {
        let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
        if (selectedItems.length > 0) {
            await Zotero.DB.executeTransaction(async function () {
                for (let item of selectedItems) {
                    if (item.isRegularItem()) {
                        if (!item.removeTag(tag)) {
                            item.addTag(tag, 0)
                        }
                        await item.save()
                    }
                }
            });
        }
    },

	_createMenuItem({parent, after}, tag, label) {
		let id = `zotero-itemmenu-zotplusplus-menu-menupopup-${tag}`;
		let menuitem = Zotero.getMainWindow().document.getElementById(id);
		if (!menuitem) {
			menuitem = Zotero.ZotPlusPlus.Doms.createMainWindowXULElement('menuitem', {
				id: id,
				command: () => {
                    Zotero.ZotPlusPlus.Logger.trace("tag", tag);
                    Zotero.ZotPlusPlus.selectedItemsTag(tag)
				},
				parent: parent,
				after: after
			});
		}
        menuitem.setAttribute('label', `${label}`);
		return menuitem;
	},

    createItemMenu() {
        // let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
        
        let root = 'zotero-itemmenu';
        let zotero_itemmenu = Zotero.getMainWindow().document.getElementById(root);
        let menuseparator = Zotero.ZotPlusPlus.Doms.createMainWindowXULMenuSeparator({
            id: `${root}-zotplusplus-separator1`,
            parent: zotero_itemmenu
        });
        this.storeAddedElement(menuseparator);
        
        // ZotPlusPlus
        let zotplusplusMenu = Zotero.ZotPlusPlus.Doms.createMainWindowXULElement('menu', {
            id: `${root}-zotplusplus-menu`,
            attrs: {
                // 'data-l10n-id': 'zotero-zotplusplus',
                'label': 'ZotPP: set tags',
            },
            props: {
                // 'icon': 'chrome://zotplusplus/content/images/zotplusplus.png',
            },
            parent: zotero_itemmenu
        });
        this.storeAddedElement(zotplusplusMenu);
        // zotplusplusMenu.disabled = true;

        let menupopupZotPlusPlus = Zotero.ZotPlusPlus.Doms.createMainWindowXULElement('menupopup', {
            id: `${root}-zotplusplus-menu-menupopup`,
            parent: zotplusplusMenu
        });
        
        // ZotPlusPlus > tags
        let tags = Zotero.ZotPlusPlus.Prefs.getJson("tags-string")
        for (const tag in tags) {
            Zotero.ZotPlusPlus.Logger.trace(tag, `${tags[tag]} (${tag})`);
            this._createMenuItem({ parent: menupopupZotPlusPlus }, tag, `${tags[tag]} (${tag})`);
        }
    },

    registerEvent() {
        Zotero.ZotPlusPlus.Events.register({
            // itemsViewOnSelect: this.itemsViewOnSelect.bind(this),
            // noteEditorKeyup: this.noteEditorKeyup.bind(this),
            // refreshCollectionMenuPopup: this.refreshCollectionMenuPopup.bind(this),
            refreshItemMenuPopup: this.refreshItemMenuPopup.bind(this),
            // refreshStandaloneMenuPopup: this.refreshStandaloneMenuPopup.bind(this),
            // refreshPaneItemMenuPopup: this.refreshPaneItemMenuPopup.bind(this)
        });
    },

    refreshItemMenuPopup(e) {
        Zotero.ZotPlusPlus.Logger.log(e.target.id);

        switch (e.target.id) {
            case 'zotero-itemmenu':
                this.createItemMenu();
                break;

            default:
                break;
        }
    },

    addToWindow(window) {
        let doc = window.document;
        Zotero.ZotPlusPlus.Logger.log("addToWindow: " + window.location.href);

        // createElementNS() necessary in Zotero 6; createElement() defaults to HTML in Zotero 7
        let HTML_NS = "http://www.w3.org/1999/xhtml";
        let XUL_NS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

        // // Add a stylesheet to the main Zotero pane
        // let link1 = doc.createElementNS(HTML_NS, 'link');
        // link1.id = 'make-it-red-stylesheet';
        // link1.type = 'text/css';
        // link1.rel = 'stylesheet';
        // link1.href = this.rootURI + 'style.css';
        // doc.documentElement.appendChild(link1);
        // this.storeAddedElement(link1);

        // // Add menu option
        // let menuitem = doc.createElementNS(XUL_NS, 'menuitem');
        // menuitem.id = 'make-it-green-instead';
        // menuitem.setAttribute('type', 'checkbox');
        // // menuitem.setAttribute('data-l10n-id', 'make-it-red-green-instead');
        // menuitem.setAttribute('label', 'make-it-red-green-instead')
        // menuitem.addEventListener('command', () => {
        //     window.alert("make-it-red-green-instead")
        //     // Zotero.ZotPlusPlus.toggleGreen(window, menuitem.getAttribute('checked') === 'true');
        // });
        // doc.getElementById('menu_viewPopup').appendChild(menuitem);
        // this.storeAddedElement(menuitem);

        // // Use strings from make-it-red.ftl (Fluent) in Zotero 7
        // if (Zotero.platformMajorVersion >= 102) {
        //     window.MozXULElement.insertFTLIfNeeded("make-it-red.ftl");
        // }
        // // Use strings from make-it-red.properties (legacy properties format) in Zotero 6
        // else {
        //     let stringBundle = Services.strings.createBundle(
        //         'chrome://make-it-red/locale/make-it-red.properties'
        //     );
        //     doc.getElementById('make-it-green-instead')
        //         .setAttribute('label', stringBundle.GetStringFromName('makeItGreenInstead.label'));
        // }

    },

    addToAllWindows() {
        var windows = Zotero.getMainWindows();
        for (let win of windows) {
            if (!win.ZoteroPane) continue;
            this.addToWindow(win);
        }
    },

    storeAddedElement(elem) {
        if (!elem.id) {
            throw new Error("Element must have an id");
        }
        this.addedElementIDs.push(elem.id);
    },

    removeFromWindow(window) {
        var doc = window.document;
        Zotero.ZotPlusPlus.Logger.log("removeFromWindow: " + doc);
        // Remove all elements added to DOM
        for (let id of this.addedElementIDs) {
            // ?. (null coalescing operator) not available in Zotero 6
            let elem = doc.getElementById(id);
            if (elem) elem.remove();
        }
        // doc.querySelector('[href="make-it-red.ftl"]').remove();
    },

    removeFromAllWindows() {
        var windows = Zotero.getMainWindows();
        for (let win of windows) {
            if (!win.ZoteroPane) continue;
            this.removeFromWindow(win);
        }
    },

    // toggleGreen(window, enabled) {
    //     let docElem = window.document.documentElement;
    //     // Element#toggleAttribute() is not supported in Zotero 6
    //     if (enabled) {
    //         docElem.setAttribute('data-green-instead', 'true');
    //     }
    //     else {
    //         docElem.removeAttribute('data-green-instead');
    //     }
    // },

    onMainWindowLoad({ window }) {
        Zotero.ZotPlusPlus.addToWindow(window);
    },
    onMainWindowUnload({ window }) {
        Zotero.ZotPlusPlus.removeFromWindow(window);
    },

    async onPrefWindowLoad({ window }) {
        var options = {
            pluginID: "zot-plus-plus",
            src: this.rootURI + "chrome/content/zot-plus-plus/preferences.xhtml",
            label: "Zot Plus Plus",
            image: `chrome://zot-plus-plus/skin/information.png`,
            defaultXUL: true,
        };

        options.id ||
            (options.id = `plugin-zotero-prefpane-${options.pluginID}`);
        const contentOrXHR = await Zotero.File.getContentsAsync(
            options.src
        );
        const content =
            typeof contentOrXHR === "string"
                ? contentOrXHR
                : "";
        Zotero.ZotPlusPlus.Logger.trace("content", content);
        const src = `<prefpane xmlns="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul" id="${options.id
            }" insertafter="zotero-prefpane-advanced" label="${options.label || options.pluginID
            }" image="${options.image || ""}">
                ${content}
                </prefpane>`;
        Zotero.ZotPlusPlus.Logger.trace("src", src);

        // const frag = this.ui.parseXHTMLToFragment(
        //     src,
        //     options.extraDTD,
        //     options.defaultXUL
        // );
        // * For Zotero 6: mainWindow.DOMParser or nsIDOMParser
        // * For Zotero 7: Firefox 102 support DOMParser natively
        let parser = undefined
        if (Zotero.platformMajorVersion < 102) {
            parser = new window.DOMParser();
        } else {
            parser = new DOMParser();
        }
        const xulns =
            "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
        const htmlns = "http://www.w3.org/1999/xhtml";
        options.extraDTD ||
            (options.extraDTD = []);
        const wrappedStr = `${options.extraDTD.length
            ? `<!DOCTYPE bindings [ ${options.extraDTD.reduce((preamble, url, index) => {
                return (
                    preamble +
                    `<!ENTITY % _dtd-${index} SYSTEM "${url}"> %_dtd-${index}; `
                );
            }, "")}]>`
            : ""
            }
            <html:div xmlns="${options.defaultXUL ? xulns : htmlns}"
                xmlns:xul="${xulns}" xmlns:html="${htmlns}">
            ${src}
            </html:div>`;
        Zotero.ZotPlusPlus.Logger.trace("wrappedStr", wrappedStr);

        let doc = parser.parseFromString(wrappedStr, "text/xml");
        Zotero.ZotPlusPlus.Logger.trace("doc", doc);

        if (doc.documentElement.localName === "parsererror") {
            throw new Error("not well-formed XHTML");
        }

        // We use a range here so that we don't access the inner DOM elements from
        // JavaScript before they are imported and inserted into a document.
        let range = doc.createRange();
        range.selectNodeContents(doc.querySelector("div"));
        let frag = range.extractContents();
        // Zotero.ZotPlusPlus.Logger.trace("frag", frag);

        const prefWindow = window.document.querySelector("prefwindow");
        // Zotero.ZotPlusPlus.Logger.trace("prefWindow.outerHTML", prefWindow.outerHTML);
        prefWindow.appendChild(frag);

        const prefPane = window.document.querySelector(`#${options.id}`);
        prefWindow.addPane(prefPane);
    },
    onPrefWindowUnload({ window }) {
    },

    async showSpecialTagsColumn() {
        await Zotero.Schema.schemaUpdatePromise;
        // only do this stuff for the first run
        if (!this._initialized) {
        }

        var trim = (s) => {
            return s.replace(/^\s*/, '').replace(/\s*$/, '')
        }

        // returns undefined/null if no matching pref
        // var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
        // var tagFilterStringPref = trim(prefManager.getCharPref("extensions.zotero.zot-plus-plus.tags-string") || "");
        var tagFilterStringPref = trim(Zotero.Prefs.get('extensions.zotero.zot-plus-plus.tags-string', true) || "");
        Zotero.ZotPlusPlus.Logger.log("tag filter string: " + tagFilterStringPref);

        var specialTagsMapping = {};
        if (tagFilterStringPref.startsWith("{") && tagFilterStringPref.endsWith("}")) {
            Zotero.ZotPlusPlus.Logger.log("parsing settings as JSON")
            specialTagsMapping = JSON.parse(tagFilterStringPref)
        // } else {
        //     Zotero.ZotPlusPlus.Logger.log("parsing settings as comma-delimited string")
        //     var tagFilterStringSplit = tagFilterStringPref.split(",")
        //     for (var i = 0; i < tagFilterStringSplit.length; ++i) {
        //         let tagFilterString = trim(tagFilterStringSplit[i])
        //         if (tagFilterString.length == 0) {
        //             continue;
        //         }
        //         specialTagsMapping[tagFilterString] = true;
        //     }
        }
        Zotero.ZotPlusPlus.Logger.log("Loaded special tags: " + JSON.stringify(specialTagsMapping));
        
        // ref better-bibtex.ts:264 $patch$ technique
        // import ItemTree from 'zotero/itemTree';
        // const itemTree = require('zotero/itemTree')
        // https://groups.google.com/g/zotero-dev/c/ftlb7v1o03o/m/V0E-htDuCgAJ
        const itemTree = Zotero.getMainWindow().require('zotero/itemTree')
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
            const icon = Zotero.getMainWindow().document.createElementNS('http://www.w3.org/1999/xhtml', 'span')
            // icon.className = 'icon icon-bg cell-icon'
            icon.innerText = tags.join(" ")

            const cell = Zotero.getMainWindow().document.createElementNS('http://www.w3.org/1999/xhtml', 'span')
            cell.className = `cell ${col.className}`
            cell.append(icon)
            return cell
        }
    },

    async main() {
    //     // Global properties are imported above in Zotero 6 and included automatically in
    //     // Zotero 7
    //     // var host = new URL('https://foo.com/path').host;
    //     // Zotero.ZotPlusPlus.Logger.log(`Host is ${host}`);

    //     // Retrieve a global pref
    //     // Zotero.ZotPlusPlus.Logger.log(`Tags string is ${Zotero.Prefs.get('extensions.zotero.zot-plus-plus.tags-string', true)}`);
    //     // Zotero.ZotPlusPlus.Logger.log(`Tags string is ${decodeURIComponent(Zotero.Prefs.get('extensions.zotero.zot-plus-plus.tags-string', true))}`);

    },
});