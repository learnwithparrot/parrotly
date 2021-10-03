import browser from 'webextension-polyfill';
import { EXTENSION_MESSAGES } from "@parrotly.io/constants"
import { playWord, translate } from './common-functions';
import { saveToRepetitionList, signInWithGoogle } from './firebase'


browser.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    switch (request.type) {
      case EXTENSION_MESSAGES.PLAY_TEXT:
        playWord(request.translation, 'de');
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
      case EXTENSION_MESSAGES.ADD_WORD_TO_SELECTION_LIST:
        saveToRepetitionList(request.text, request.translation);
        break;
      case EXTENSION_MESSAGES.ON_AUTH_CREDENTIALS:
        signInWithGoogle(request.credential);
        break;

    }
  }
);

