'use strict'
if (!Zotero.ZotPlusPlus) Zotero.ZotPlusPlus = {};
if (!Zotero.ZotPlusPlus.Prefs) Zotero.ZotPlusPlus.Prefs = {};

Zotero.ZotPlusPlus.Prefs = Object.assign(Zotero.ZotPlusPlus.Prefs, {
    _prefix: "",

    init(prefix) {
        this._prefix = prefix;
        Zotero.ZotPlusPlus.Logger.log('Zotero.ZotPlusPlus.Prefs inited.');
    },

    get(pref, def) {
        let val = Zotero.Prefs.get(`${this._prefix}.${pref}`);
        // Zotero.ZotPlusPlus.Logger.log(`${pref} = ${val} `);
        return val !== undefined ? val : def;
    },

    set(pref, val) {
        if (val) {
            Zotero.Prefs.set(`${this._prefix}.${pref}`, val);
        } else {
            this.clear(pref);
        }
    },

    clear(pref) {
        Zotero.Prefs.clear(`${this._prefix}.${pref}`);
    },

    getJson(pref, def) {
        let val = Zotero.Prefs.get(`${this._prefix}.${pref}`);
        try {
            return val !== undefined ? JSON.parse(val) : def;
        } catch (e) {
            Zotero.ZotPlusPlus.Logger.log(e);
            return def;
        }
    },

    getJsonValue(pref, key, def) {
        let json = this.getJson(pref);
        return json !== undefined && json[key] ? json[key] : def;
    },

    setJson(pref, val) {
        if (val) {
            Zotero.Prefs.set(`${this._prefix}.${pref}`, JSON.stringify(val));
        } else {
            this.clear(pref);
        }
    },

    setJsonValue(pref, key, val) {
        let json = this.getJson(pref);
        if (!json) {
            json = {};
        }
        if (val) {
            json[key] = val;
        } else {
            delete json[key];
        }
        this.setJson(pref, json);
    },
});