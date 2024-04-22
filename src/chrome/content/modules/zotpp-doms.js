if (!Zotero.ZotPlusPlus) Zotero.ZotPlusPlus = {};
if (!Zotero.ZotPlusPlus.Doms) Zotero.ZotPlusPlus.Doms = {};

Zotero.ZotPlusPlus.Doms = Object.assign(Zotero.ZotPlusPlus.Doms, {
    init() {
        Zotero.ZotPlusPlus.Logger.log('Zotero.ZotPlusPlus.Doms inited.');
    },

    createXULElement(document, tag, { id, attrs, props, parent, after, before, childs, command, onclick }) {
        let ele = id ? document.getElementById(id) : undefined;
        if (ele) {
            return ele;
        }
        // let element = document.createXULElement(tag);
        let element = undefined
        if (Zotero.platformMajorVersion < 102) {
            element = document.createElementNS(
                "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",
                tag
            );
        } else {
            element = document.createXULElement(tag);
        }
        if (id) {
            element.id = id;
        }
        if (attrs) {
            for (const key in attrs) {
                if (Object.hasOwnProperty.call(attrs, key)) {
                    const value = attrs[key];
                    element.setAttribute(key, value);
                }
            }
        }
        if (props) {
            for (const key in props) {
                if (Object.hasOwnProperty.call(props, key)) {
                    const value = props[key];
                    element[key] = value;
                }
            }
        }
        if (command) {
            element.addEventListener('command', command);
        }
        if (onclick) {
            element.onclick = onclick;
        }
        if (childs && childs.length > 0) {
            element.appendChild(childs);
        }
        if (parent) {
            parent.appendChild(element);
        } else if (after) {
            after.after(element);
        } else if (before) {
            before.before(element);
        }
        return element;
    },

    createMainWindowXULElement(tag, { id, attrs, props, parent, after, before, childs, command, onclick }) {
        return this.createXULElement(Zotero.getMainWindow().document, tag, { id, attrs, props, parent, after, before, childs, command, onclick });;
    },

    createMainWindowXULMenuSeparator({ id, attrs, props, parent, after, before, childs, command, onclick }) {
        return this.createMainWindowXULElement('menuseparator', { id, attrs, props, parent, after, before, childs, command, onclick });
    },

    getMainWindowElementById(id) {
        return Zotero.getMainWindow().document.getElementById(id);
    },

    getMainWindowQuerySelector(selector) {
        return Zotero.getMainWindow().document.querySelector(selector);
    },

    existsMainWindowElementById(id) {
        return !!Zotero.getMainWindow().document.getElementById(id);
    },

    existsMainWindowquerySelector(selector) {
        return !!Zotero.getMainWindow().document.querySelector(selector);
    }
});