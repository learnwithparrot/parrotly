import browser from 'webextension-polyfill';
import { EXTENSION_MESSAGES } from "@parrotly.io/constants"
import { MESSAGES } from "@parrotly.io/types"
import { playWord, translate, getCurrentTheme } from './common-functions';
import {
  deleteRepetitionWord, saveToRepetitionList,
  updateUserSettings, signIn, logout,
  incrementWordDisplayCount, disableShowWord,
} from './firebase';
import { notificationTimeOut } from './background-process'

async function changeTheme() {
  try {
    const isDarkTheme = await getCurrentTheme()
    const tabs = await browser.tabs.query({});
    if (tabs?.length)
      for (const tab of tabs)
        try {
          browser.tabs.sendMessage(
            tab.id,
            { type: EXTENSION_MESSAGES.CHANGE_THEME, isDarkTheme }
          )
        } catch (err) { console.warn(err) }
  } catch (err) {
    console.warn({ err, here: 'get current theme' })
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
          request.languageWord, request.languageTranslation, request.text,
          async ({ translation }: { translation: string, isTranslated: boolean, alternatives: string[] }) => {
            const tabs = await browser.tabs.query({ "active": true, "currentWindow": true });
            browser.tabs.sendMessage(tabs[0].id, {
              type: EXTENSION_MESSAGES.TRANSLATION_COMPLETE,
              text: translation,
            })
          });
        break;
      case EXTENSION_MESSAGES.ADD_WORD_TO_REPETITION_LIST:
        saveToRepetitionList(request.text, request.translation);
        break;
      case EXTENSION_MESSAGES.ON_WORD_SHOWN:
        clearTimeout(notificationTimeOut);
        if(request.trigger === EXTENSION_MESSAGES.SHOW_WORD)
          incrementWordDisplayCount(request.id, request.categoryId, 'show');
        break;
      case EXTENSION_MESSAGES.MCQ_ANSWER:
        incrementWordDisplayCount(request.id, request.categoryId, 'mcq', request.isRightAnswer);
        break;
      case EXTENSION_MESSAGES.DISABLE_SHOW_WORD:
        disableShowWord(request.durationHours);
        break;
      case EXTENSION_MESSAGES.ON_AUTH_CREDENTIALS:
        signIn(request.idToken, request?.email, request?.password);
        break;
      case EXTENSION_MESSAGES.ON_SIGN_OUT:
        logout();
        break;
      case EXTENSION_MESSAGES.TRIGGER_SHOW_WORD:
        browser.tabs.query({ "active": true, "currentWindow": true }).then(tabs => {
          browser.tabs.sendMessage(tabs[0].id, {
            type: EXTENSION_MESSAGES.SHOW_WORD,
          });
        })
        break;
      case EXTENSION_MESSAGES.KNOW_WORD:
        deleteRepetitionWord(request.id, request.categoryId)
        break;
      case EXTENSION_MESSAGES.UPDATE_USER_SETTINGS:
        updateUserSettings(request.settings, request.id)
        break;
      case EXTENSION_MESSAGES.GET_CURRENT_THEME:
        changeTheme()
        break;
    }
  }
);
