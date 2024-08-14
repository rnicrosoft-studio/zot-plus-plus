import { config } from "../../package.json";
import { getLocaleID, getString } from "../utils/locale";
import { UIFactory } from "./ui";

export class PrefFactory {
  // 注册设置页面
  static registerPrefs() {
    const prefOptions = {
      pluginID: config.addonID,
      src: rootURI + "chrome/content/preferences.xhtml",
      label: getString("prefs-title"),
      image: `chrome://${config.addonRef}/content/icons/favicon.png`,
      defaultXUL: true,
    };
    ztoolkit.PreferencePane.register(prefOptions);
  }
}