import { config } from "../../package.json";
import { getLocaleID, getString } from "../utils/locale";
import { Logger } from "../utils/logger";
import { TagFactory } from "./tag";

const logger = new Logger();

export class UIFactory {
  /**
   * 注册列 - ZotPP tags
   */
  static async registerZotPPTagsColumn() {
    const field = "zotpp-tags";
    await Zotero.ItemTreeManager.registerColumns({
      pluginID: config.addonID,
      dataKey: field,
      label: getString("column-zotpp-tags"), //"ZotPP tags",
      dataProvider: (item: Zotero.Item, dataKey: string) => {
        if (!item.isRegularItem()) {
          return "";
        }
        if (TagFactory.zotPPTagsMapping === undefined) {
          TagFactory.loadZotPPTags();
        }
        // logger.log(TagFactory.zotPPTagsMapping)
        const tags = Object.keys(TagFactory.zotPPTagsMapping!)
          .map((tagItem) => {
            for (const iterator of item.getTags()) {
              if (iterator.tag == tagItem) {
                return TagFactory.zotPPTagsMapping![tagItem];
              }
            }
            return undefined;
          })
          .filter((ele) => ele);

        return tags.join(" ");
      },
    });
  }

  /**
   * 注册条目右键菜单 - ZotPP: set tags子菜单
   */
  static registerSetZotPPTagsRightClickMenuPopup() {
    // Zotero.MenuManager.registerMenu({
    //   menuID: `${addon.data.config.addonID}-menu-item-set-tag-separator`,
    //   pluginID: addon.data.config.addonID,
    //   target: "main/library/item",
    //   menus: [
    //     {
    //       menuType: "separator",
    //     },
    //   ],
    // });

    if (TagFactory.zotPPTagsMapping === undefined) {
      TagFactory.loadZotPPTags();
    }

    const menupopups = Object.keys(TagFactory.zotPPTagsMapping!)
      .map((tagItem) => {
        return <_ZoteroTypes.MenuManager.MenuData>{
          menuType: "menuitem",
          l10nID: `${config.addonRef}-menupopup-tag-label`,
          l10nArgs: {
            label: `${TagFactory.zotPPTagsMapping![tagItem]} (${tagItem})`,
          },
          onCommand: (event, context) => {
            logger.trace("tag", tagItem);
            TagFactory.selectedItemsTag(tagItem);
          },
        };
      })
      .filter((ele) => ele);
    logger.log(menupopups);

    Zotero.MenuManager.registerMenu({
      menuID: `${addon.data.config.addonID}-menu-item-set-tag`,
      pluginID: addon.data.config.addonID,
      target: "main/library/item",
      menus: [
        {
          menuType: "submenu",
          l10nID: `${config.addonRef}-menupopup-set-tags-label`,
          icon: `chrome://${config.addonRef}/content/icons/favicon.png`,
          menus: menupopups,
        },
      ],
    });
  }

  /**
   * 注册条目右键菜单 - ZotPP: 打开附件
   */
  static registerOpenAttachmentRightClickMenuItem() {
    const menuIcon = `chrome://${config.addonRef}/content/icons/favicon.png`;

    // Zotero.MenuManager.registerMenu({
    //   menuID: `${addon.data.config.addonID}-menu-item-open-attachment-separator`,
    //   pluginID: addon.data.config.addonID,
    //   target: "main/library/item",
    //   menus: [
    //     {
    //       menuType: "separator",
    //     }
    //   ],
    // });

    // 打开附件到 新标签页
    Zotero.MenuManager.registerMenu({
      menuID: `${addon.data.config.addonID}-menu-item-open-attachment-in-tab-label`,
      pluginID: addon.data.config.addonID,
      target: "main/library/item",
      menus: [
        {
          menuType: "menuitem",
          l10nID: `${config.addonRef}-menupopup-open-attachment-in-tab-label`,
          icon: menuIcon,
          onShowing: (event, context) => {
            const item = Zotero.getActiveZoteroPane().getSelectedItems()[0];
            if (item.isRegularItem()) {
              if (Zotero.Prefs.get("fileHandler.pdf") !== "") {
                context.setVisible(true);
                return true;
              } else {
                context.setVisible(false);
                return false;
              }
            } else if (item.isAttachment()) {
              if (
                (item.isPDFAttachment() &&
                  Zotero.Prefs.get("fileHandler.pdf") !== "") ||
                (item.attachmentReaderType === "epub" &&
                  Zotero.Prefs.get("fileHandler.epub") !== "") ||
                (item.attachmentReaderType === "snapshot" &&
                  Zotero.Prefs.get("fileHandler.snapshot") !== "")
              ) {
                context.setVisible(true);
                return true;
              } else {
                context.setVisible(false);
                return false;
              }
            } else {
              context.setVisible(false);
              return false;
            }
          },
          onCommand: (event, context) => {
            const selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
            if (selectedItems.length > 0) {
              for (const item of selectedItems) {
                if (item.isRegularItem()) {
                  item.getBestAttachment().then((bestAttachment) => {
                    if (bestAttachment === false) {
                      return;
                    }
                    Zotero.Reader.open(bestAttachment.id, undefined, {
                      openInWindow: false,
                    });
                  });
                } else if (item.isAttachment()) {
                  Zotero.Reader.open(item.id, undefined, { openInWindow: false });
                }
              }
            }
          },
        }
      ]
    });

    // 打开附件到 新窗口
    Zotero.MenuManager.registerMenu({
      menuID: `${addon.data.config.addonID}-menu-item-open-attachment-in-window-label`,
      pluginID: addon.data.config.addonID,
      target: "main/library/item",
      menus: [
        {
          menuType: "menuitem",
          l10nID: `${config.addonRef}-menupopup-open-attachment-in-window-label`,
          icon: menuIcon,
          onShowing: (event, context) => {
            const item = Zotero.getActiveZoteroPane().getSelectedItems()[0];
            if (item.isRegularItem()) {
              if (Zotero.Prefs.get("fileHandler.pdf") !== "") {
                context.setVisible(true);
                return true;
              } else {
                context.setVisible(false);
                return false;
              }
            } else if (item.isAttachment()) {
              if (
                (item.isPDFAttachment() &&
                  Zotero.Prefs.get("fileHandler.pdf") !== "") ||
                (item.attachmentReaderType === "epub" &&
                  Zotero.Prefs.get("fileHandler.epub") !== "") ||
                (item.attachmentReaderType === "snapshot" &&
                  Zotero.Prefs.get("fileHandler.snapshot") !== "")
              ) {
                context.setVisible(true);
                return true;
              } else {
                context.setVisible(false);
                return false;
              }
            } else {
              context.setVisible(false);
              return false;
            }
          },
          onCommand: (event, context) => {
            const selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
            if (selectedItems.length > 0) {
              for (const item of selectedItems) {
                if (item.isRegularItem()) {
                  item.getBestAttachment().then((bestAttachment) => {
                    if (bestAttachment === false) {
                      return;
                    }
                    Zotero.Reader.open(bestAttachment.id, undefined, {
                      openInWindow: true,
                    });
                  });
                } else if (item.isAttachment()) {
                  Zotero.Reader.open(item.id, undefined, { openInWindow: true });
                }
              }
            }
          },
        }
      ]
      // "after",
      // document.querySelector(
      //   // `menupopup#zotero-itemmenu > menuitem.zotero-menuitem-view-online`
      //   `menuitem[data-l10n-id="item-menu-viewAttachment"]`
      // ) as XUL.MenuItem,
    });

    // 打开附件到 系统默认程序
    Zotero.MenuManager.registerMenu({
      menuID: `${addon.data.config.addonID}-menu-item-open-attachment-in-system-default-label`,
      pluginID: addon.data.config.addonID,
      target: "main/library/item",
      menus: [
        {
          menuType: "menuitem",
          l10nID: `${config.addonRef}-menupopup-open-attachment-in-system-default-label`,
          icon: menuIcon,
          onShowing: (event, context) => {
            const item = Zotero.getActiveZoteroPane().getSelectedItems()[0];
            if (item.isRegularItem()) {
              if (Zotero.Prefs.get("fileHandler.pdf") !== "system") {
                context.setVisible(true);
                return true;
              } else {
                context.setVisible(false);
                return false;
              }
            } else if (item.isAttachment()) {
              if (
                (item.isPDFAttachment() &&
                  Zotero.Prefs.get("fileHandler.pdf") !== "system") ||
                (item.attachmentReaderType === "epub" &&
                  Zotero.Prefs.get("fileHandler.epub") !== "system") ||
                (item.attachmentReaderType === "snapshot" &&
                  Zotero.Prefs.get("fileHandler.snapshot") !== "system")
              ) {
                context.setVisible(true);
                return true;
              } else {
                context.setVisible(false);
                return false;
              }
            } else {
              context.setVisible(false);
              return false;
            }
          },
          onCommand: (event, context) => {
            const selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
            if (selectedItems.length > 0) {
              for (const item of selectedItems) {
                if (item.isRegularItem()) {
                  item.getBestAttachment().then((bestAttachment) => {
                    if (bestAttachment === false) {
                      return;
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
      ]
    });
  }
}
