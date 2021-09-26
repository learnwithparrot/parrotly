import browser from 'webextension-polyfill';
import { EXTENSION_MESSAGES } from "@parrotly.io/constants"
import { saveToRepetitionList, signInWithGoogle } from './firebase'

browser.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log({ request })
    if (request.type === EXTENSION_MESSAGES.ADD_WORD_TO_SELECTION_LIST) {
      saveToRepetitionList(request.word)
    } else if (request.type === EXTENSION_MESSAGES.ON_AUTH_CREDENTIALS) {
      const credential = request.credential
      signInWithGoogle(credential)
    }
  }
);
