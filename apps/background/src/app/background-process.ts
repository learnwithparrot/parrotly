import { switchMap, mapTo, first, delay, tap } from 'rxjs/operators';
import { timer, Observable, NEVER, Subject, of } from 'rxjs';
import { userAndSettings$, categoriesAndLists$, incrementWordDisplayCount } from './firebase';
import type { IRepetitionList, IRepetitionWord, IUserSettings, MESSAGE_SHOW_WORD } from '@parrotly.io/types';
import { setStorageItem, getStorageItem } from './storage';
import { StorageKeys } from './constants';
import browser from 'webextension-polyfill'
import { EXTENSION_MESSAGES } from '@parrotly.io/constants';
import { NOTIFICATION_TITLE } from '@parrotly.io/env';

type Notification = {
  word: IRepetitionWord,
  category: IRepetitionList
};
export const triggerNotification = new Subject<Notification>();
const SIX_SECONDS = 6000;
const triggerNotification$ = triggerNotification.pipe(
  tap(notif => console.log({ notif })),
  switchMap(notif => notif ? timer(SIX_SECONDS).pipe(mapTo(notif)) : NEVER)
)

/**
 * This is the background process that collects the user/settings and runs determination of word/showCard
 * depending on user settings.
 */
export function initBackgroundProcess() {
  userAndSettings$.pipe(
    switchMap(
      ([, settings]) => {
        if (!settings) NEVER as Observable<IUserSettings>
        const period = (settings.showCardDurationSeconds + (settings.showCardIntervalDurationMinutes * 60)) * 1000;
        console.log({ settings })
        const delayShowWord = settings.disableUntil?.showWord;
        const initialDelay: Date | number = delayShowWord ? delayShowWord.toDate() : period;
        return timer(initialDelay, period).pipe(
          mapTo(settings)
        )
      }
    )
  )
    .subscribe(triggerShowCard)

  triggerNotification$.subscribe(
    ({ word, category }) => showNotification(word, category)
  );
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
        triggerNotification.next({ word, category });
      });
  }
  /**Browser window isn't the active window */
  else triggerNotification.next({ word, category })
}

async function showNotification(word: IRepetitionWord, category: IRepetitionList) {
  const options = {
    type: "basic",
    title: NOTIFICATION_TITLE,
    message: `${word.word} - ${word.translation}`,
    iconUrl: "images/parrot_4.png",
    priority: 2
  }

  const _notificationId = `learn_with_parrot_${word.id}`;
  await browser.notifications.create(_notificationId, options);
  incrementWordDisplayCount(word.id, category.id, 'show')
}
