import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
import type { MESSAGE_SHOW_SIDENAV } from '@parrotly.io/types';
import { first } from 'rxjs/operators';
import browser from 'webextension-polyfill';
import { environment } from '../environments/environment.prod';
import { userAndSettings$ } from './firebase/firestore'

function openTab(url) {
  browser.tabs.create({ url })
}

browser.runtime.onInstalled.addListener(details => {
  const siteWelcomePage = `${environment.site_url}/auth/login`;
  if (details.reason === 'install') {
    openTab(siteWelcomePage)
    // Promise.all([
    //   browser.tabs.create({
    //     url: siteWelcomePage,
    //   }),
    // ]);
  }
});

// Track uninstall before redirecting to feedback form
// Don't open a new tab on dev
browser.runtime.setUninstallURL(environment.production ? '' : `${environment.site_url}/redirect/uninstall`);

browser.browserAction.onClicked.addListener(async ({ id }) => {
  const [user, settings] = await userAndSettings$.pipe(first()).toPromise()
  if (id) {
    const tabs = await browser.tabs.query({ "active": true, "currentWindow": true });
    const message: MESSAGE_SHOW_SIDENAV = {
      type: EXTENSION_MESSAGES.SHOW_SIDE_NAV,
      user, settings
    }
    browser.tabs.sendMessage(tabs[0].id, message)
      .catch(err => {
        console.error({ err, showSideNav: true })
        openTab(environment.site_url)
      });
  }
});
