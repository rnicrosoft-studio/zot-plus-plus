import { config } from "../../package.json";
import { Logger } from "./logger";

/**
 * Get preference value.
 * Wrapper of `Zotero.Prefs.get`.
 * @param key
 */
export function getPref(key: string) {
  return Zotero.Prefs.get(`${config.prefsPrefix}.${key}`, true);
}

export function get(key: string, def: any) {
  let val = getPref(key);
  // new Logger().trace(key, val);
  return val !== undefined ? val : def;
}

/**
 * Set preference value.
 * Wrapper of `Zotero.Prefs.set`.
 * @param key
 * @param value
 */
export function setPref(key: string, value: string | number | boolean) {
  return Zotero.Prefs.set(`${config.prefsPrefix}.${key}`, value, true);
}

export function set(key: string, value: any) {
  if (value) {
    Zotero.Prefs.set(`${config.prefsPrefix}.${key}`, value);
  } else {
    clearPref(key);
  }
}

/**
 * Clear preference value.
 * Wrapper of `Zotero.Prefs.clear`.
 * @param key
 */
export function clearPref(key: string) {
  return Zotero.Prefs.clear(`${config.prefsPrefix}.${key}`, true);
}


export function getJson(key: string, def: any = undefined) {
  let val = Zotero.Prefs.get(`${config.prefsPrefix}.${key}`) as string;
  try {
    return val !== undefined ? JSON.parse(val) : def;
  } catch (e) {
    Zotero.ZotPlusPlus.Logger.log(e);
    return def;
  }
}

export function getJsonValue(key: string, key2: string, def: any) {
  let json = getJson(key);
  return json !== undefined && json[key2] ? json[key2] : def;
}

export function setJson(key: string, value: string) {
  if (value) {
    Zotero.Prefs.set(`${config.prefsPrefix}.${key}`, JSON.stringify(value));
  } else {
    clearPref(key);
  }
}

export function setJsonValue(key: string, key2: string, value: any) {
  let json = getJson(key);
  if (!json) {
    json = {};
  }
  if (value) {
    json[key2] = value;
  } else {
    delete json[key2];
  }
  setJson(key, json);
}
