import { config } from "../../package.json";
import { getLocaleID, getString } from "../utils/locale";
import { UIFactory } from "./ui";

export class PrefFactory {
  // 注册设置页面
  static registerPrefs() {
    Zotero.PreferencePanes.register({
      pluginID: config.addonID,
      src: rootURI + "content/preferences.xhtml",
      label: getString("prefs-title"),
      image: `chrome://${config.addonRef}/content/icons/favicon.png`,
    });
  }
}