/*
 * @Author       : rnicrosoft
 * @Created      : 2022-09-02 01:47:17
 * 
 * Copyright (c) 2022 rnicrosoft
 * Confidential and proprietary.  All rights reserved.
 */

/**
 * Set tag to selected items, or remove the tag if the items have already had.
 * @return {void}
 */
Zotero.ZotPlusPlus.selectedItemsTag = async function (tag) {
    let selectedItems = Zotero.getActiveZoteroPane().getSelectedItems();
    if (selectedItems.length > 0) {
        await Zotero.DB.executeTransaction(async function () {
            // for (let item of selectedItems) {
            //     if (item.isRegularItem()) {
            //         if (!item.removeTag(tag)) {
            //             item.addTag(tag, 0)
            //         }
            //     }
            // }
            for (let item of selectedItems) {
                if (item.isRegularItem()) {
                    if (!item.removeTag(tag)) {
                        item.addTag(tag, 0)
                    }
                    await item.save()
                }
            }
        });
    }
}
