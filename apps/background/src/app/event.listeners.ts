import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
import type { IUserSettings, MESSAGE_SHOW_SIDENAV } from '@parrotly.io/types';
import { User } from 'firebase/auth';
import { of } from 'rxjs';
import { first, timeoutWith } from 'rxjs/operators';
import browser from 'webextension-polyfill';
import { environment } from '../environments/environment.prod';
import { userAndSettings$ } from './firebase/firestore'

function openTab(url) {
  browser.tabs.create({ url })
}

browser.runtime.onInstalled.addListener(details => {
  const siteWelcomePage = `${environment.site_url}/auth/signout`;
  if (details.reason === 'install') openTab(siteWelcomePage)
});

// Track uninstall before redirecting to feedback form
// Don't open a new tab on dev
browser.runtime.setUninstallURL(environment.production ? '' : `${environment.site_url}/redirect/uninstall`);

browser.browserAction.onClicked.addListener(async ({ id }) => {
  try {
    const [user, settings] = await userAndSettings$.pipe(
      timeoutWith(100, of([undefined as User, undefined as IUserSettings])),
      first()
    ).toPromise();
    if (id) {
      const tabs = await browser.tabs.query({ "active": true, "currentWindow": true });
      const message: MESSAGE_SHOW_SIDENAV = {
        type: EXTENSION_MESSAGES.SHOW_SIDE_NAV,
        user, settings
      }
      browser.tabs.sendMessage(tabs[0].id, message)
        .catch(err => {
          openTab(environment.site_url)
        });
    }
  } catch (err) {
    console.warn({ err, here: "browserAction clicked" })
  }
});
