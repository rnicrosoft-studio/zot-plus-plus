import { config } from "../../package.json";
import { Logger } from "./logger";

const logger = new Logger()

type PluginPrefsMap = _ZoteroTypes.Prefs["PluginPrefsMap"];

const PREFS_PREFIX = config.prefsPrefix;

/**
 * Get preference value.
 * Wrapper of `Zotero.Prefs.get`.
 * @param key
 */
export function getPref<K extends keyof PluginPrefsMap>(key: K) {
  return Zotero.Prefs.get(`${PREFS_PREFIX}.${key}`, true) as PluginPrefsMap[K];
}

export function get<K extends keyof PluginPrefsMap>(key: K, def: any) {
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
export function setPref<K extends keyof PluginPrefsMap>(
  key: K,
  value: PluginPrefsMap[K],
) {
  return Zotero.Prefs.set(`${PREFS_PREFIX}.${key}`, value, true);
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
  return Zotero.Prefs.clear(`${PREFS_PREFIX}.${key}`, true);
}


export function getJson(key: string, def: any = undefined) {
  let val = Zotero.Prefs.get(`${config.prefsPrefix}.${key}`) as string;
  try {
    return val !== undefined ? JSON.parse(val) : def;
  } catch (e) {
    // Zotero.ZotPlusPlus.Logger.log(e);
    logger.log(e);
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
