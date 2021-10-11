import { switchMap, mapTo } from 'rxjs/operators';
import { interval } from 'rxjs';
import { idToken$, userAndSettings$, categoriesAndLists$ } from './firebase';
import { IUserSettings } from '@parrotly.io/types';
import { setStorageItem, getStorageItem } from './storage';
import { StorageKeys } from './constants';
import browser from 'webextension-polyfill'
import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
/**
 * This is the background process that collects the user/settings and runs determination of word/showCard
 * depending on user settings.
 */
export function initBackgroundProcess() {
  const triggerShowCard$ = userAndSettings$.pipe(
    switchMap(
      (settings) => interval(20 * 1000).pipe(
        // (settings) => interval(settings.showCardIntervalDurationSeconds * 1000).pipe(
        mapTo(settings)
      )
    )
  )
    .subscribe(triggerShowCard)

  idToken$.subscribe(token => setStorageItem(StorageKeys.auth_id_token, token))
}

/**
 * Determines word to be shown and sends to be shown either as
 * nativeCard or notification.
 * @param settings settings of the user
 * @returns
 */
async function triggerShowCard(settings: IUserSettings) {
  const categoriesAndLists = await categoriesAndLists$.toPromise()
  console.log('triggering showCard', categoriesAndLists)
  if (categoriesAndLists.map(([_, list]) => list.length).every(count => !count)) {
    console.log('Repetition List is empty returning quietly.')
    return;
  }
  const lastWordDocId = await getStorageItem({ storageKey: StorageKeys.last_word })

  const [category, list] = categoriesAndLists[0]

  let randomNumber = Math.floor(Math.random() * list.length);
  if (list[randomNumber].id === lastWordDocId) {
    if (category.wordCount > 1) {
      randomNumber = Math.floor(Math.random() * list.length);
    }
  }

  const word = list[randomNumber]
  setStorageItem(StorageKeys.last_word, word.id)

  const tabs = await browser.tabs.query({ "active": true, "currentWindow": true });
  browser.tabs.sendMessage(
    tabs[0].id,
    { type: EXTENSION_MESSAGES.SHOW_WORD, word, category, settings }
  );




}
