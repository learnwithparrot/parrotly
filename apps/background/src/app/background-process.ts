import { switchMap, mapTo, first } from 'rxjs/operators';
import { timer, Observable, NEVER } from 'rxjs';
import { userAndSettings$, categoriesAndLists$, incrementWordDisplayCount } from './firebase';
import type { IRepetitionList, IRepetitionWord, IUserSettings, MESSAGE_SHOW_WORD } from '@parrotly.io/types';
import { setStorageItem, getStorageItem } from './storage';
import { StorageKeys } from './constants';
import browser from 'webextension-polyfill'
import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
import { NOTIFICATION_TITLE } from '@parrotly.io/env';

export let notificationTimeOut;

/**
 * This is the background process that collects the user/settings and runs determination of word/showCard
 * depending on user settings.
 */
export function initBackgroundProcess() {
  userAndSettings$.pipe(
    switchMap(
      ([user, settings]) => {
        if (!settings) NEVER as Observable<IUserSettings>
        const period = (settings.showCardDurationSeconds + (settings.showCardIntervalDurationMinutes * 60)) * 1000;
        const initialDelay: Date | number = settings.disableUntil?.showWord?.toDate() ?? period;
        console.log({ initialDelay })
        return timer(initialDelay, period).pipe(
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

  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const showMCQ = word.countShows >= settings.maximumRepetition && list.length > 7
  const message: MESSAGE_SHOW_WORD = {
    type: showMCQ ? EXTENSION_MESSAGES.SHOW_MCQ : EXTENSION_MESSAGES.SHOW_WORD,
    word, category, settings
  }
  if (showMCQ) {
    const index1 = Math.floor(Math.random() * list.length);
    const index2 = Math.floor(Math.random() * list.length);
    const options = [index1, index2].map(i => list[i].translation);
    message.options = options
  }

  if (tabs?.length) {
    browser.tabs.sendMessage(tabs[0]?.id, message)
      .catch(err => {
        /**
         * User is on a page within which content script can't be loaded.
         * example:
         * -firefox: about:addons
         * -chrome: chrome://extensions
         */
      });
    notificationTimeOut = setTimeout(() => {
      showNotification(word, category)
    }, 1000);
  }
  /**Browser window isn't the active window */
  else showNotification(word, category)
}

async function showNotification(word: IRepetitionWord, category: IRepetitionList) {
  const options = {
    type: "basic",
    title: NOTIFICATION_TITLE,
    message: `${word.word} - ${word.translation}`,
    iconUrl: "images/parrot_4.png",
    priority: 2
  }

  console.log('showing notification')
  const _notificationId = "parrotly.io" + Math.floor(Math.random() * 9999999);
  await browser.notifications.create(_notificationId, options);
  incrementWordDisplayCount(word.id, category.id, 'show')
}
