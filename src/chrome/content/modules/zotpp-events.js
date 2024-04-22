if (!Zotero.ZotPlusPlus) Zotero.ZotPlusPlus = {};
if (!Zotero.ZotPlusPlus.Events) Zotero.ZotPlusPlus.Events = {};

Zotero.ZotPlusPlus.Events = Object.assign(Zotero.ZotPlusPlus.Events, {
    // itemsViewOnSelect: null,
    // noteEditorKeyup: null,
    // refreshCollectionMenuPopup: null,
    refreshItemMenuPopup: null,
    // refreshStandaloneMenuPopup: null,
    // refreshPaneItemMenuPopup: null,

    init() {
        // 注册事件
        Zotero.ZotPlusPlus.Logger.log('Zotero.ZotPlusPlus.Events inited.');
    },

    register({ itemsViewOnSelect, noteEditorKeyup, refreshCollectionMenuPopup, refreshItemMenuPopup, refreshStandaloneMenuPopup, refreshPaneItemMenuPopup }) {
        // this.itemsViewOnSelect = itemsViewOnSelect;
        // this.noteEditorKeyup = noteEditorKeyup;
        // this.refreshCollectionMenuPopup = refreshCollectionMenuPopup;
        this.refreshItemMenuPopup = refreshItemMenuPopup;
        // this.refreshStandaloneMenuPopup = refreshStandaloneMenuPopup;
        // this.refreshPaneItemMenuPopup = refreshPaneItemMenuPopup;

        // Zotero.getMainWindow().ZoteroPane.itemsView.waitForLoad().then(function () {
        //     Zotero.getMainWindow().Zotero.getMainWindow().ZoteroPane.itemsView.onSelect.addListener(this.itemsViewOnSelect);
        //     Zotero.ZotPlusPlus.Logger.log('itemsViewOnSelect registered.');
        // }.bind(this));

        // Zotero.getMainWindow().document.getElementById('zotero-items-tree').addEventListener('select', this.itemsViewOnSelect.bind(this), false);
        // Zotero.ZotPlusPlus.Logger.log('itemsViewOnSelect registered.');
        // Zotero.getMainWindow().document.getElementById('zotero-note-editor').addEventListener('keyup', this.noteEditorKeyup, false);
        // Zotero.ZotPlusPlus.Logger.log('noteEditorKeyup registered.');
        // Zotero.getMainWindow().document.getElementById('zotero-collectionmenu').addEventListener('popupshowing', this.refreshCollectionMenuPopup, false);
        // Zotero.ZotPlusPlus.Logger.log('refreshCollectionMenuPopup registered.');
        Zotero.getMainWindow().document.getElementById('zotero-itemmenu').addEventListener('popupshowing', this.refreshItemMenuPopup, false);
        Zotero.ZotPlusPlus.Logger.log('refreshItemMenuPopup registered.');
        // Zotero.getMainWindow().document.getElementById('zotero-tb-note-add').addEventListener('popupshowing', this.refreshStandaloneMenuPopup, false);
        // Zotero.ZotPlusPlus.Logger.log('refreshStandaloneMenuPopup registered.');
        // Zotero.getMainWindow().document.getElementById('context-pane-add-child-note-button-popup').addEventListener('popupshowing', this.refreshPaneItemMenuPopup, false);
        // Zotero.ZotPlusPlus.Logger.log('refreshPaneItemMenuPopup registered.');

        Zotero.ZotPlusPlus.Logger.log('Zotero.ZotPlusPlus.Events registered.');
    },

    shutdown() {
        // if (this.itemsViewOnSelect) {
        //     Zotero.getMainWindow().ZoteroPane.itemsView.onSelect.removeListener(this.itemsViewOnSelect);
        //     Zotero.ZotPlusPlus.Logger.log('noteEditorKeyup removed.');
        // }
        // if (this.noteEditorKeyup) {
        //     Zotero.getMainWindow().document.getElementById('zotero-note-editor').removeEventListener('keyup', this.noteEditorKeyup, false);
        //     Zotero.ZotPlusPlus.Logger.log('noteEditorOnKeyup removed.');
        // }
        // if (this.refreshCollectionMenuPopup) {
        //     Zotero.getMainWindow().document.getElementById('zotero-collectionmenu').removeEventListener('popupshowing', this.refreshCollectionMenuPopup, false);
        //     Zotero.ZotPlusPlus.Logger.log('refreshCollectionMenuPopup removed.');
        // }
        if (this.refreshItemMenuPopup) {
            Zotero.getMainWindow().document.getElementById('zotero-itemmenu').removeEventListener('popupshowing', this.refreshItemMenuPopup, false);
            Zotero.ZotPlusPlus.Logger.log('refreshItemMenuPopup removed.');
        }
        // if (this.refreshStandaloneMenuPopup) {
        //     Zotero.getMainWindow().document.getElementById('zotero-tb-note-add').removeEventListener('popupshowing', this.refreshStandaloneMenuPopup, false);
        //     Zotero.ZotPlusPlus.Logger.log('refreshStandaloneMenuPopup removed.');
        // }
        // if (this.refreshPaneItemMenuPopup) {
        //     Zotero.getMainWindow().document.getElementById('context-pane-add-child-note-button-popup').removeEventListener('popupshowing', this.refreshPaneItemMenuPopup, false);
        //     Zotero.ZotPlusPlus.Logger.log('refreshPaneItemMenuPopup removed.');
        // }
    }
});