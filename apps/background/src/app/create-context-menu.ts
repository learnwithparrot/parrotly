// import chrome from 'webextension-polyfill';
import browser from 'webextension-polyfill';
import { EXTENSION_MESSAGES } from "@parrotly.io/constants"

const isMac = navigator.userAgent.indexOf("Mac") >= 0;

/**
 * Add entry to the context menu.
 */
browser.contextMenus.create({
  title: function () {
    // if (isMac) {
    //   return "Parrotly (Cmd + Shift + E)";
    // } else {
    // }
    return "Parrotly (Ctrl + Shift + E)";
  }(),
  contexts: ["selection"],
  documentUrlPatterns: ["https://*/*", "http://*/*"],
  onclick: async function (event) {
    const tabs = await browser.tabs.query({ "active": true, "currentWindow": true });
    browser.tabs.sendMessage(
      tabs[0].id,
      { type: EXTENSION_MESSAGES.SHOW_ADD_WORD_TO_SELECTION_LIST }
    );
  }
});

