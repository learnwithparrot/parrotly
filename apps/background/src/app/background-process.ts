import { switchMap, mapTo, first } from 'rxjs/operators';
import { EMPTY, interval, Observable } from 'rxjs';
import { userAndSettings$, categoriesAndLists$, incrementWordShowCount } from './firebase';
import type { IRepetitionList, IRepetitionWord, IUserSettings, MESSAGE_SHOW_WORD } from '@parrotly.io/types';
import { setStorageItem, getStorageItem } from './storage';
import { StorageKeys } from './constants';
import browser from 'webextension-polyfill'
import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
import { NOTIFICATION_TITLE } from '@parrotly.io/env';

/**
 * This is the background process that collects the user/settings and runs determination of word/showCard
 * depending on user settings.
 */
export function initBackgroundProcess() {
  const triggerShowCardSub = userAndSettings$.pipe(
    switchMap(
      ([user, settings]) => {
        if (!settings) EMPTY as Observable<IUserSettings>
        return interval((settings.showCardDurationSeconds + (settings.showCardIntervalDurationMinutes * 60)) * 1000).pipe(
          mapTo(settings)
        )
      }
    )
  )
    .subscribe(triggerShowCard)
}

/**
 * Determines word to be shown and sends to be shown either as
 * nativeCard or notification.
 * @param settings settings of the user
 * @returns
 */
async function triggerShowCard(settings: IUserSettings) {
  const categoriesAndLists = await categoriesAndLists$.pipe(first()).toPromise()
  if (categoriesAndLists.map(([_, list]) => list.length).every(count => !count)) {
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

  const tabs = await browser.tabs.query(
    { active: true, currentWindow: true, }
  );
  const message: MESSAGE_SHOW_WORD = {
    type: EXTENSION_MESSAGES.SHOW_WORD,
    word, category, settings
  }
  if (tabs?.length)
    browser.tabs.sendMessage(tabs[0].id, message)
      .then(() => {
        //@TODO: implement logic too for quiz and mcq fails and passes count
        incrementWordShowCount(word.id, category.id, 'show')
      })
      .catch(err => {
        /**
         * User is on a page within which content script can't be loaded.
         * example:
         * -firefox: about:addons
         * -chrome: chrome://extensions
         */
        console.error({ err })
        showNotification(word, category)
      });
  /**Browser window isn't the active window */
  else showNotification(word, category)
}

function showNotification(word: IRepetitionWord, category: IRepetitionList) {
  const options = {
    type: "basic",
    title: NOTIFICATION_TITLE,
    message: `${word.word} - ${word.translation}`,
    iconUrl: "images/parrot_4.png",
    // requireInteraction: true,
    priority: 2
  }
  const _notificationId = "parrotly.io" + Math.floor(Math.random() * 9999999);
  browser.notifications.create(_notificationId, options);
  incrementWordShowCount(word.id, category.id, 'show')
}
