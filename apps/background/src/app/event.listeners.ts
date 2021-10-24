import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
import { first } from 'rxjs/operators';
import browser from 'webextension-polyfill';
import { environment } from '../environments/environment.prod';
import { userAndSettings$ } from './firebase/firestore'
browser.runtime.onInstalled.addListener(details => {
  const siteWelcomePage = `${environment.site_url}/onboarding`;
  if (details.reason === 'install') {
    Promise.all([
      browser.tabs.create({
        url: siteWelcomePage,
      }),
    ]);
  }
});

// Track uninstall before redirecting to feedback form
// Don't open a new tab on dev
browser.runtime.setUninstallURL(environment.production ? '' : `${environment.site_url}/redirect/uninstall`);

browser.browserAction.onClicked.addListener(async ({ id }) => {
  const [user, settings] = await userAndSettings$.pipe(first()).toPromise()
  if (id) {
    const tabs = await browser.tabs.query({ "active": true, "currentWindow": true });
    browser.tabs.sendMessage(tabs[0].id, { type: EXTENSION_MESSAGES.SHOW_SIDE_NAV , user, settings});
  }
});
