import { MenuitemOptions } from "zotero-plugin-toolkit";
import { config } from "../../package.json";
import { getLocaleID, getString } from "../utils/locale";
import { Logger } from "../utils/logger";
import { TagFactory } from "./tag";

const logger = new Logger()

export class UIFactory {
  /**
   * 注册列 - ZotPP tags
   */
  static async registerZotPPTagsColumn() {
    const field = "zotpp-tags";
    await Zotero.ItemTreeManager.registerColumns({
      pluginID: config.addonID,
      dataKey: field,
      label: getString("column-zotpp-tags"),//"ZotPP tags",
      dataProvider: (item: Zotero.Item, dataKey: string) => {
        if (!item.isRegularItem()) {
          return "";
        }
        if (TagFactory.zotPPTagsMapping === undefined) {
          TagFactory.loadZotPPTags()
        }
        // logger.log(TagFactory.zotPPTagsMapping)
        const tags = Object.keys(TagFactory.zotPPTagsMapping!).map((tagItem) => {
          for (const iterator of item.getTags()) {
            if (iterator.tag == tagItem) {
              return TagFactory.zotPPTagsMapping![tagItem]
            }
          }
          return undefined
        }).filter(ele => ele)

        return tags.join(" ");
      },
    });

  }

  /**
   * 注册条目右键菜单 - ZotPP: set tags子菜单
   */
  static registerSetZotPPTagsRightClickMenuPopup() {
    ztoolkit.Menu.register("item", {
      tag: "menuseparator",
    });

    if (TagFactory.zotPPTagsMapping === undefined) {
      TagFactory.loadZotPPTags()
    }

    let menupopups = Object.keys(TagFactory.zotPPTagsMapping!).map((tagItem) => {
      return <MenuitemOptions>{
        tag: "menuitem",
        label: `${TagFactory.zotPPTagsMapping![tagItem]} (${tagItem})`,
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

  /**
   * 注册条目右键菜单 - ZotPP: 打开附件
   */
  static registerOpenAttachmentRightClickMenuItem() {
    const menuIcon = `chrome://${config.addonRef}/content/icons/favicon.png`;

    ztoolkit.Menu.register("item", {
      tag: "menuseparator",
    });

    // 打开附件到 新标签页
    ztoolkit.Menu.register(
      "item",
      {
        tag: "menuitem",
        label: getString("menupopup-open-attachment-in-label") + " " + getString("menupopup-tab-label"),
        icon: menuIcon,
        getVisibility(elem, ev) {
          let item = Zotero.getActiveZoteroPane().getSelectedItems()[0];
          if (item.isRegularItem()) {
            if (Zotero.Prefs.get("fileHandler.pdf") !== "") {
              return true
            } else {
              return false
            }
          } else if (item.isAttachment()) {
            if ((item.isPDFAttachment() && Zotero.Prefs.get("fileHandler.pdf") !== "")
              || (item.attachmentReaderType === "epub" && Zotero.Prefs.get("fileHandler.epub") !== "")
              || (item.attachmentReaderType === "snapshot" && Zotero.Prefs.get("fileHandler.snapshot") !== "")) {
              return true
            } else {
              return false
            }
          } else {
            return false
          }
        },
        commandListener: (ev) => {
          let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
          if (selectedItems.length > 0) {
            for (let item of selectedItems) {
              if (item.isRegularItem()) {
                item.getBestAttachment().then((bestAttachment) => {
                  if (bestAttachment === false) {
                    return
                  }
                  Zotero.Reader.open(bestAttachment.id, undefined, { openInWindow: false });
                });
              } else if (item.isAttachment()) {
                Zotero.Reader.open(item.id, undefined, { openInWindow: false });
              }
            }
          }
        },
      }
    );

    // 打开附件到 新窗口
    ztoolkit.Menu.register(
      "item",
      {
        tag: "menuitem",
        label: getString("menupopup-open-attachment-in-label") + " " + getString("menupopup-window-label"),
        icon: menuIcon,
        getVisibility(elem, ev) {
          let item = Zotero.getActiveZoteroPane().getSelectedItems()[0];
          if (item.isRegularItem()) {
            if (Zotero.Prefs.get("fileHandler.pdf") !== "") {
              return true
            } else {
              return false
            }
          } else if (item.isAttachment()) {
            if ((item.isPDFAttachment() && Zotero.Prefs.get("fileHandler.pdf") !== "")
              || (item.attachmentReaderType === "epub" && Zotero.Prefs.get("fileHandler.epub") !== "")
              || (item.attachmentReaderType === "snapshot" && Zotero.Prefs.get("fileHandler.snapshot") !== "")) {
              return true
            } else {
              return false
            }
          } else {
            return false
          }
        },
        commandListener: (ev) => {
          let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
          if (selectedItems.length > 0) {
            for (let item of selectedItems) {
              if (item.isRegularItem()) {
                item.getBestAttachment().then((bestAttachment) => {
                  if (bestAttachment === false) {
                    return
                  }
                  Zotero.Reader.open(bestAttachment.id, undefined, { openInWindow: true });
                });
              } else if (item.isAttachment()) {
                Zotero.Reader.open(item.id, undefined, { openInWindow: true });
              }
            }
          }
        },
      },
      // "after",
      // document.querySelector(
      //   // `menupopup#zotero-itemmenu > menuitem.zotero-menuitem-view-online`
      //   `menuitem[data-l10n-id="item-menu-viewAttachment"]`
      // ) as XUL.MenuItem,
    );


    // 打开附件到 系统默认程序
    ztoolkit.Menu.register(
      "item",
      {
        tag: "menuitem",
        label: getString("menupopup-open-attachment-in-label") + " " + getString("menupopup-system-default-label"),
        icon: menuIcon,
        getVisibility(elem, ev) {
          let item = Zotero.getActiveZoteroPane().getSelectedItems()[0];
          if (item.isRegularItem()) {
            if (Zotero.Prefs.get("fileHandler.pdf") !== "system") {
              return true
            } else {
              return false
            }
          } else if (item.isAttachment()) {
            if ((item.isPDFAttachment() && Zotero.Prefs.get("fileHandler.pdf") !== "system")
              || (item.attachmentReaderType === "epub" && Zotero.Prefs.get("fileHandler.epub") !== "system")
              || (item.attachmentReaderType === "snapshot" && Zotero.Prefs.get("fileHandler.snapshot") !== "system")) {
              return true
            } else {
              return false
            }
          } else {
            return false
          }
        },
        commandListener: (ev) => {
          let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
          if (selectedItems.length > 0) {
            for (let item of selectedItems) {
              if (item.isRegularItem()) {
                item.getBestAttachment().then((bestAttachment) => {
                  if (bestAttachment === false) {
                    return
                  }
                  Zotero.launchFile(bestAttachment.getFilePath() as string);
                });
              } else if (item.isAttachment()) {
                Zotero.launchFile(item.getFilePath() as string);
              }
            }
          }
        },
      }
    );

  }

}
