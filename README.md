# Zot Plus Plus

## Introduction
Zotero++ (ZotPP), an enhancement plugin to [Zotero](https://www.zotero.org/).

## Features
- [ ] TBD
> Inspired from [zotero-special-tags-column](https://github.com/whacked/zotero-special-tags-column):
> - [ ] Rate items with stars in extra columns using defined tags
> - [ ] Mark items as unread/read in extra columns using defined tags

## Appendix: Special tags
After the installation of the plugin, paste this json manually in the preference pane to correct the emojis.
```json
{
    "zotpp_1": "❶",
    "zotpp_2": "❷",
    "zotpp_3": "❸",
    "zotpp_4": "❹",
    "zotpp_5": "❺",
    "zotpp_6": "❻",
    "zotpp_7": "❼",
    "zotpp_8": "❽",
    "zotpp_9": "❾",
    "zotpp_10": "❿",

    "zotpp_star_0_5": "☆☆☆☆☆",
    "zotpp_star_1_5": "★☆☆☆☆",
    "zotpp_star_2_5": "★★☆☆☆",
    "zotpp_star_3_5": "★★★☆☆",
    "zotpp_star_4_5": "★★★★☆",
    "zotpp_star_5_5": "★★★★★",

    "zotpp_pinned": "📌",
    "zotpp_star": "⭐",
    "zotpp_flag": "🚩",

    "zotpp_fire": "🔥",
    "zotpp_water": "💧",
    "zotpp_boom": "💥",
    "zotpp_check": "✔️",
    "zotpp_cross": "❌",
    "zotpp_circ": "⭕",
    "zotpp_exclamation": "❗",
    "zotpp_question": "❓"
}
```

## Appendix: Setting Up a Plugin Development Environment
1. Close Zotero.
1. Create a text file in the 'extensions' directory of your [Zotero profile directory](https://www.zotero.org/support/kb/profile_directory) named after the extension id (e.g., myplugin@mydomain.org). The file contents should be the absolute path to the root of your plugin source code directory, where your `install.rdf` file is located.
1. Open `prefs.js` in the Zotero profile directory in a text editor and delete the lines containing `extensions.lastAppBuildId` and `extensions.lastAppVersion`. Save the file and restart Zotero. This will force Zotero to read the 'extensions' directory and install your plugin from source, after which you should see it listed in `Tools → Add-ons`. This is only necessary once.
1. Whenever you start up Zotero after making a change to your extension code, start it from the command line and pass the `-purgecaches` flag to force Zotero to re-read any cached files. (You'll likely want to make an alias or shell script that also includes the `-ZoteroDebugText` and `-jsconsole` flags and perhaps `-p <Profile>`, where `<Profile>` is the name of a development profile.)