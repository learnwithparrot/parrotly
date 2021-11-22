import type { LanguageType } from "@parrotly.io/constants";

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
  enableNotifications: boolean,
}

export interface IUserAutoTranslationSettings {
  quantityOfTranslations: 'small' | 'medium' | 'large' | 'extra-large';
}

export interface IUserLanguageSettings {
  languageSpoken: LanguageType;
  languageLearned: LanguageType;
}

export interface IUserSettings extends IUserLanguageSettings, IUserReptitionListSettings, IUserAutoTranslationSettings {
  id: string,
  theme: 'light' | 'dark' | 'auto' | 'rotate',
  forbiddenUrls: string[],
}
