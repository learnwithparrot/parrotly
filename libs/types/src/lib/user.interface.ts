import type { Language } from "@parrotly.io/constants";
import type { Timestamp } from 'firebase/firestore'

export interface IUser {
  isAdmin?: boolean,
  email: string;
  displayName: string;
  photoUrl: string;
  id: string;
}

export interface IUserReptitionListSettings {
  showCardIntervalDurationMinutes: number,
  maximumRepetition: number,
  maximumQuizzes: number,
  maximumMCQs: number,
  showCardDurationSeconds: number,
  showMCQDurationSeconds: number,
  enableNotifications: boolean,
}

export interface IUserAutoTranslationSettings {
  quantityOfTranslations: 'small' | 'medium' | 'large' | 'extra-large';
}

export interface IUserLanguageSettings {
  languageSpoken?: Language;
  languageLearned?: Language;
}

export interface IUserSettings<T extends Date | Timestamp = Timestamp> extends IUserLanguageSettings, IUserReptitionListSettings, IUserAutoTranslationSettings {
  id: string,
  theme: 'light' | 'dark',
  forbiddenUrls: string[],
  disableUntil?: {
    showWord: T,
    autoTranslation: T
  }
}
