import { MenuitemOptions } from "zotero-plugin-toolkit/dist/managers/menu";
import { config } from "../../package.json";
import { getLocaleID, getString } from "../utils/locale";
import { Logger } from "../utils/logger";
import { TagFactory } from "./tag";

const logger = new Logger()

export class UIFactory {
  /**
   * 注册额外的列 ZotPP tags
   */
  static async registerExtraColumn() {
    const field = "zotpp-tags";
    await Zotero.ItemTreeManager.registerColumns({
      pluginID: config.addonID,
      dataKey: field,
      label: getString("column-zotpp-tags"),//"ZotPP tags",
      dataProvider: (item: Zotero.Item, dataKey: string) => {
        if (item.isNote() || item.isAttachment() || (item.isAnnotation != null ? item.isAnnotation() : null)) {
          return "";
        }
        if (TagFactory.zotPPTagsMapping === undefined) {
          TagFactory.loadZotPPTags()
        }
        // logger.log(TagFactory.zotPPTagsMapping)
        let zotPPTagsMapping = TagFactory.zotPPTagsMapping;
        const tags = Object.keys(zotPPTagsMapping).map((tagItem) => {
          for (const iterator of item.getTags()) {
            if (iterator.tag == tagItem) {
              return zotPPTagsMapping[tagItem]
            }
          }
          return undefined
        }).filter(ele => ele)

        return tags.join(" ");
      },
    });

  }

  /**
   * 注册条目右键菜单 - 打开ZotPP:set tags子菜单
   */
  static registerRightClickMenuPopup() {
    ztoolkit.Menu.register("item", {
      tag: "menuseparator",
    });

    if (TagFactory.zotPPTagsMapping === undefined) {
      TagFactory.loadZotPPTags()
    }

    let menupopups = Object.keys(TagFactory.zotPPTagsMapping).map((tagItem) => {
      return <MenuitemOptions>{
        tag: "menuitem",
        label: `${TagFactory.zotPPTagsMapping[tagItem]} (${tagItem})`,
        //     oncommand: "alert('Hello World! Sub Menuitem.')",
        commandListener: (ev) => {
          logger.trace("tag", tagItem);
          TagFactory.selectedItemsTag(tagItem);
        },
      }
    }).filter(ele => ele)
    logger.log(menupopups)

    ztoolkit.Menu.register(
      "item",
      {
        tag: "menu",
        id: `zotero-itemmenu-${config.addonRef}-menu`,
        label: getString("menupopup-set-tags-label"),
        icon: `chrome://${config.addonRef}/content/icons/favicon.png`,
        children: menupopups,
      },
    );

  }
}