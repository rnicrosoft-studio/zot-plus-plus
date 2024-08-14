import { config } from "../../package.json";
var moment = require('moment'); // require

export class Logger {
    // constructor() {
    //     this.log('Zotero.ZotPlusPlus.Logger inited.');
    // },
    isDebug(): boolean {
        // return typeof Zotero !== 'undefined' && typeof Zotero.Debug !== 'undefined' && Zotero.Debug.enabled;
        return __env__ === "development";
    }
    log(message: any): void {
        // if (Zotero.ZotPlusPlus.Objects.isUndefined(message)) {
        //     this.debug('undefined');
        // } else if (Zotero.ZotPlusPlus.Objects.isNull(message)) {
        //     this.debug('null');
        // } else if (Zotero.ZotPlusPlus.Objects.isEmptyString(message)) {
        //     this.debug('');
        // } else if (Zotero.ZotPlusPlus.Objects.isObject(message)) {
        //     this.debug(this._stringifyJSON(message));
        // } else if (Zotero.ZotPlusPlus.Objects.isArray(message)) {
        //     this.debug('[' + message.join(', ') + ']');
        // } else {
        ztoolkit.log(`${this._outPrefix()} ${message}`);
        // }
    }

    trace(name: string, value: any): void {
        if (this.isDebug()) {
            // if (Zotero.ZotPlusPlus.Objects.isUndefined(value)) {
            //     this.debug(`${name} >>> undefined`);
            // } else if (Zotero.ZotPlusPlus.Objects.isNull(value)) {
            //     this.debug(`${name} >>> null`);
            // } else if (Zotero.ZotPlusPlus.Objects.isEmptyString(value)) {
            //     this.debug(`${name} >>> ""`);
            // } else if (Zotero.ZotPlusPlus.Objects.isObject(value)) {
            //     this.debug(`${name} >>> ` + this._stringifyJSON(value));
            // } else if (Zotero.ZotPlusPlus.Objects.isArray(value)) {
            //     this.debug(`${name} >>> [` + value.join(', ') + ']');
            // } else {
            ztoolkit.log(`${this._outPrefix()} ${name} >>> ${value}`);
            // }
        }
    }

    error(err: Error): void {
        // if (Zotero.ZotPlusPlus.Objects.isObject(err)) {
        //     Zotero.logError(`${this._outPrefix()} ${filename}:${line}@${method}: ` + JSON.stringify(err));
        // } else if (Zotero.ZotPlusPlus.Objects.isArray(err)) {
        //     Zotero.logError(`${this._outPrefix()} ${filename}:${line}@${method}: ` + '[' + err.join(', ') + ']');
        // } else {
        Zotero.logError(err);
        // }
    }

    debug(message: any): void {
        var { method, filename, line } = this.getStack()!;
        Zotero.debug(`${this._outPrefix()} [${config.addonName}] ${filename}:${line}@${method}: ${message}`);
    }

    //  ding() {
    //     var { method, filename, line } = this.getStack();
    //     Zotero.debug(`${this._outPrefix()} ${filename}:${line}@${method} ${Zotero.isMac ? '📌' : '!'}`);
    // }

    _stringifyJSON(value: any): string {
        return JSON.stringify(value, null, 2).split('\n').map((e, i) => i > 0 ? '  ' + e : e).join('\n');
    }

    getStack() {
        var array = new Error().stack!.split('\n');
        var method, filename, line;
        for (let index = 0; index < array.length; index++) {
            const element = array[index];
            // if (element.includes('chrome://zotero/content/runJS.js')) {
            //     filename = 'runJS.js';
            //     method = '@';
            //     line = _parseRegExpGroup(/(\d*)\:\d*$/, element);
            //     return { method, filename, line };
            // }
            filename = this._parseRegExpGroup(/.*\/(.*?js)\:.*$/, element);

            if (filename === 'zot-plus-plus.js' && method === 'getStack') {
                continue;
            }

            method = this._parseRegExpGroup(/^(.*?)@.*$/, element);
            line = this._parseRegExpGroup(/(\d*)\:\d*$/, element);
            return { method, filename, line };
        }
    }

    _parseRegExpGroup(reg: RegExp, str: string): string {
        var ret = reg.exec(str);
        if (ret && str.length > 1) {
            return ret[1];
        } else {
            Zotero.debug(`${this._outPrefix()}: ${reg}, ${str}, ${ret}`);
            return "";
        }
    }

    _outPrefix(): string {
        let now = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        // return `${Zotero.isMac ? '🤪' : '^-^'}${now} - ${Zotero.ZotPlusPlus.Selfs.id}(${Zotero.ZotPlusPlus.Selfs.version})`;
        return `${now} ${Zotero.isMac ? '🔵' : Zotero.Prefs.get('extensions.zotero.zot-plus-plus.log-prefix', true)}`;
    }
}