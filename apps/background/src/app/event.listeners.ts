import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
import type { IUserSettings, MESSAGE_SHOW_SIDENAV } from '@parrotly.io/types';
import { User } from 'firebase/auth';
import { of } from 'rxjs';
import { first, timeoutWith } from 'rxjs/operators';
import browser from 'webextension-polyfill';
import { environment } from '../environments/environment.prod';
import { notifyCurrentTab, openTab } from './browser';
import { userAndSettings$ } from './firebase/firestore'
import { triggerShowSideNav } from './message.listeners';

browser.runtime.onInstalled.addListener(details => {
  const siteWelcomePage = `${environment.site_url}/auth/signout`;
  if (details.reason === 'install') openTab(siteWelcomePage)
});

// Track uninstall before redirecting to feedback form
// Don't open a new tab on dev
browser.runtime.setUninstallURL(environment.production ? '' : `${environment.site_url}/redirect/uninstall`);

browser.browserAction.onClicked.addListener(async ({ id }) => {
  try {
    if (id) triggerShowSideNav();
  } catch (err) {
    console.warn({ err, here: "browserAction clicked" })
  }
});
