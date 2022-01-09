import type { EXTENSION_MESSAGES } from "@parrotly.io/constants";
import type { Language } from "@parrotly.io/constants";
import type { IRepetitionList, IRepetitionWord, IUserSettings } from "..";

export type MESSAGE_PLAY_TEXT = {
  type: typeof EXTENSION_MESSAGES.PLAY_TEXT,
  text: string,
  lang: Language,
}

export type MESSAGE_TRANSLATE_TEXT = {
  type: typeof EXTENSION_MESSAGES.TRANSLATE_TEXT,
  text: string,
  languageWord: Language,
  languageTranslation: Language,
}

export type MESSAGE_ADD_WORD_TO_REPETITION_LIST = {
  type: typeof EXTENSION_MESSAGES.ADD_WORD_TO_REPETITION_LIST,
  text,
  translation,
}

export type MESSAGE_AUTH_CREDENTIAL = {
  type: typeof EXTENSION_MESSAGES.ON_AUTH_CREDENTIALS,
  idToken: string, password?: string, email?: string
}

export type MESSAGE_SIGN_OUT = {
  type: typeof EXTENSION_MESSAGES.ON_SIGN_OUT,
}

export type MESSAGE_TRIGGER_SHOW_WORD = {
  type: typeof EXTENSION_MESSAGES.TRIGGER_SHOW_WORD
}

export type MESSAGE_KNOW_WORD = {
  type: typeof EXTENSION_MESSAGES.KNOW_WORD,
  id: string, categoryId: string,
}

export type MESSAGE_MCQ_ANSWER = {
  type: typeof EXTENSION_MESSAGES.MCQ_ANSWER,
  id: string, categoryId: string, isRightAnswer: boolean,
}

export type MESSAGE_UPDATE_USER_SETTINGS = {
  type: typeof EXTENSION_MESSAGES.UPDATE_USER_SETTINGS,
  settings: IUserSettings,
  id: string,
}

export type MESSAGE_CHANGE_THEME = {
  type: typeof EXTENSION_MESSAGES.GET_CURRENT_THEME,
}

export type MESSAGE_SHOW_WORD = {
  type: typeof EXTENSION_MESSAGES.SHOW_WORD | typeof EXTENSION_MESSAGES.SHOW_MCQ;
  word: IRepetitionWord;
  options?: string[];
  settings: IUserSettings;
  category: IRepetitionList;
}

export type MESSAGE_SHOW_SIDENAV = {
  type: typeof EXTENSION_MESSAGES.SHOW_SIDE_NAV,
  user, settings
}

export interface MESSAGES {
  [EXTENSION_MESSAGES.PLAY_TEXT]: MESSAGE_PLAY_TEXT,
  [EXTENSION_MESSAGES.TRANSLATE_TEXT]: MESSAGE_TRANSLATE_TEXT,
  [EXTENSION_MESSAGES.ADD_WORD_TO_REPETITION_LIST]: MESSAGE_ADD_WORD_TO_REPETITION_LIST,
  [EXTENSION_MESSAGES.ON_AUTH_CREDENTIALS]: MESSAGE_AUTH_CREDENTIAL,
  [EXTENSION_MESSAGES.TRIGGER_SHOW_WORD]: MESSAGE_TRIGGER_SHOW_WORD,
  [EXTENSION_MESSAGES.SHOW_WORD]: MESSAGE_SHOW_WORD,
  [EXTENSION_MESSAGES.KNOW_WORD]: MESSAGE_KNOW_WORD,
  [EXTENSION_MESSAGES.MCQ_ANSWER]: MESSAGE_MCQ_ANSWER,
  [EXTENSION_MESSAGES.UPDATE_USER_SETTINGS]: MESSAGE_UPDATE_USER_SETTINGS,
  [EXTENSION_MESSAGES.CHANGE_THEME]: MESSAGE_CHANGE_THEME,
  [EXTENSION_MESSAGES.SHOW_SIDE_NAV]: MESSAGE_SHOW_SIDENAV,
  [EXTENSION_MESSAGES.ON_SIGN_OUT]: MESSAGE_SIGN_OUT,

}
