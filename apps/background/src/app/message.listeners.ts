import browser from 'webextension-polyfill';
import { EXTENSION_MESSAGES } from "@parrotly.io/constants"
import { IUserSettings, MESSAGES, MESSAGE_SHOW_SIDENAV } from "@parrotly.io/types"
import { playWord, translate, isDarkTheme } from './common-functions';
import {
  deleteRepetitionWord, saveToRepetitionList,
  updateUserSettings, signIn, logout,
  incrementWordDisplayCount, disableShowWord, userAndSettings$,
} from './firebase';
import { triggerNotification } from './background-process'
import { notifyCurrentTab, notifyAllTabs, openTab } from './browser';
import { User } from 'firebase/auth';
import { environment } from '../environments/environment';
import { of } from 'rxjs';
import { first, timeoutWith } from 'rxjs/operators';

function onTranslation({ translation }: { translation: string }) {
  const data = {
    type: EXTENSION_MESSAGES.TRANSLATION_COMPLETE,
    text: translation,
  };
  notifyCurrentTab(data);
}

function changeTheme(isDarkTheme: boolean) {
  try {
    const data = {
      type: EXTENSION_MESSAGES.CHANGE_THEME,
      isDarkTheme
    };
    notifyAllTabs(data);
  } catch (err) {
    console.warn({ err, here: 'get current theme' })
  }
}

export async function triggerShowSideNav() {
  const [user, settings] = await userAndSettings$.pipe(
    timeoutWith(100, of([undefined as User, undefined as IUserSettings])),
    first()
  ).toPromise();
  const message: MESSAGE_SHOW_SIDENAV = {
    type: EXTENSION_MESSAGES.SHOW_SIDE_NAV,
    user, settings
  };
  try {
    notifyCurrentTab(message);
  } catch (err) {
    openTab(environment.site_url);
  }
}


browser.runtime.onMessage.addListener(
  async function (request: MESSAGES[keyof MESSAGES], sender, sendResponse) {
    switch (request.type) {
      case EXTENSION_MESSAGES.PLAY_TEXT:
        playWord(request.text, request.lang);
        break;
      case EXTENSION_MESSAGES.TRANSLATE_TEXT:
        translate(
          request.languageWord,
          request.languageTranslation,
          request.text,
          onTranslation
        );
        break;
      case EXTENSION_MESSAGES.ADD_WORD_TO_REPETITION_LIST:
        saveToRepetitionList(request.text, request.translation);
        break;
      case EXTENSION_MESSAGES.ON_WORD_SHOWN:
        triggerNotification.next(undefined);
        if (request.trigger === EXTENSION_MESSAGES.SHOW_WORD)
          incrementWordDisplayCount(request.id, request.categoryId, 'show');
        break;
      case EXTENSION_MESSAGES.MCQ_ANSWER:
        incrementWordDisplayCount(request.id, request.categoryId, 'mcq', request.isRightAnswer);
        break;
      case EXTENSION_MESSAGES.DISABLE_SHOW_WORD:
        disableShowWord(request.durationHours);
        break;
      case EXTENSION_MESSAGES.ON_AUTH_CREDENTIALS: {
        const result = await signIn(request.idToken, request?.email, request?.password);
        console.log({ result })
        if (!result) return;
        const data = { type: EXTENSION_MESSAGES.ON_AUTH_CREDENTIALS };
        notifyAllTabs(data);
        break;
      }
      case EXTENSION_MESSAGES.ON_SIGN_OUT: {
        logout();
        const data = { type: EXTENSION_MESSAGES.ON_SIGN_OUT };
        notifyAllTabs(data);
        break;
      }
      case EXTENSION_MESSAGES.TRIGGER_SHOW_WORD: {
        const data = { type: EXTENSION_MESSAGES.SHOW_WORD };
        notifyCurrentTab(data);
        break;
      }
      case EXTENSION_MESSAGES.SHOW_SIDE_NAV: {
        triggerShowSideNav();
        break;
      }
      case EXTENSION_MESSAGES.KNOW_WORD:
        deleteRepetitionWord(request.id, request.categoryId)
        break;
      case EXTENSION_MESSAGES.UPDATE_USER_SETTINGS: {
        await updateUserSettings(request.settings, request.id)
        //the theme of the user might have been updated.
        const isDarkTheme = request.settings.theme === 'dark';
        changeTheme(isDarkTheme);
        break;
      }
      case EXTENSION_MESSAGES.GET_CURRENT_THEME: {
        const darkTheme = await isDarkTheme()
        changeTheme(darkTheme);
        break;
      }
    }
  }
);
