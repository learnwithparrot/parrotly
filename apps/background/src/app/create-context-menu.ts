import browser from 'webextension-polyfill';
import { EXTENSION_MESSAGES } from "@parrotly.io/constants"
import { categories$ } from './firebase'
import { first, timeoutWith } from 'rxjs/operators';
import { IRepetitionList } from '@parrotly.io/types';
import { of } from 'rxjs';

const isMac = navigator.userAgent.indexOf("Mac") >= 0;

/**
 * Add entry to the context menu.
 */
browser.contextMenus.create({
  title: function () {
    if (isMac) {
      return "Parrot (Cmd + Shift + E)";
    } else {
      return "Parrot (Ctrl + Shift + E)";
    }
  }(),
  contexts: ["selection"],
  documentUrlPatterns: ["https://*/*", "http://*/*"],
  onclick: async function (event) {
    const tabs = await browser.tabs.query({ "active": true, "currentWindow": true });
    const categories = await categories$.pipe(
      timeoutWith(100, of(undefined as IRepetitionList[])),
      first()
    ).toPromise()
    console.log({categories})
    browser.tabs.sendMessage(
      tabs[0].id,
      {
        type: EXTENSION_MESSAGES.SHOW_ADD_WORD_TO_SELECTION_LIST,
        categories, userSignedIn: Boolean(categories)
      }
    );
  }
});

