import { ExtensionMessage } from "@parrotly.io/constants";
import browser from 'webextension-polyfill';

export type TabNotification = {
  type: ExtensionMessage,
  text?: string
};

export async function notifyAllTabs(data: TabNotification) {
  const tabs = await browser.tabs.query({});
  const errors = [];
  for (const tab of tabs)
    try {
      browser.tabs.sendMessage(tab.id, data);
    } catch (err) {
      errors.push(errors)
    }
  if (errors.length) throw errors;
}

export async function notifyCurrentTab(data: TabNotification) {
  const tabs = await browser.tabs.query({ "active": true, "currentWindow": true });
  browser.tabs.sendMessage(tabs[0].id, data);
}

export function openTab(url) {
  browser.tabs.create({ url })
}
