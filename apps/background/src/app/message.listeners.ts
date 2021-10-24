import browser from 'webextension-polyfill';
import { EXTENSION_MESSAGES } from "@parrotly.io/constants"
import { playWord, translate } from './common-functions';
import {
  deleteRepetitionWord, saveToRepetitionList, signInWithGoogle,
  updateUserSettings,
} from './firebase'


browser.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    switch (request.type) {
      case EXTENSION_MESSAGES.PLAY_TEXT:
        playWord(request.translation, request.lang ?? 'de');
        break;
      case EXTENSION_MESSAGES.TRANSLATE_TEXT:
        translate(
          'en', 'de', request.text,
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
      case EXTENSION_MESSAGES.ON_AUTH_CREDENTIALS:
        signInWithGoogle(request.credential);
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

    }
  }
);

