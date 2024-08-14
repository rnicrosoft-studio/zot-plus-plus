import { config } from "../../package.json";
import { getLocaleID, getString } from "../utils/locale";
import { Logger } from "../utils/logger";
import { get } from "../utils/prefs";

const logger = new Logger();

export class TagFactory {
  // constructor() {
  //   this.loadZotPPTags()
  // }
  static zotPPTagsMapping = undefined;
  static loadZotPPTags() {
    var trim = (s: string) => {
      return s.toString().replace(/^\s*/, '').replace(/\s*$/, '')
    }

    var tagFilterStringPref = trim(get('tags-string', true) || "");
    logger.log("tag filter string: " + tagFilterStringPref);

    var zotPPTagsMapping = {};
    if (tagFilterStringPref.startsWith("{") && tagFilterStringPref.endsWith("}")) {
      logger.log("parsing settings as JSON")
      zotPPTagsMapping = JSON.parse(tagFilterStringPref)
      // } else {
      //     logger.log("parsing settings as comma-delimited string")
      //     var tagFilterStringSplit = tagFilterStringPref.split(",")
      //     for (var i = 0; i < tagFilterStringSplit.length; ++i) {
      //         let tagFilterString = trim(tagFilterStringSplit[i])
      //         if (tagFilterString.length == 0) {
      //             continue;
      //         }
      //         zotPPTagsMapping[tagFilterString] = true;
      //     }
    }
    logger.log("Loaded ZotPP tags: " + JSON.stringify(zotPPTagsMapping));

    TagFactory.zotPPTagsMapping = zotPPTagsMapping
    return zotPPTagsMapping
  }


  static async selectedItemsTag(tag: string, type: number = 0) {
    let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
    if (selectedItems.length > 0) {
      await Zotero.DB.executeTransaction(async function () {
        for (let item of selectedItems) {
          if (item.isRegularItem()) {
            if (!item.removeTag(tag)) {
              item.addTag(tag, type)
            }
            await item.save()
          }
        }
      });
    }
  }

}