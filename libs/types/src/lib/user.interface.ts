import { LanguageType } from "@parrotly.io/constants";

export interface IUser {
  isAdmin?: boolean,
  email: string;
  displayName: string;
  photoUrl: string;
  id: string;
}

export interface IUserSettings {
  languageSpoken: LanguageType;
  languageLearned: LanguageType;
  id: string,
  showCardIntervalDurationSeconds: number,
  theme: 'light' | 'dark' | 'auto' | 'rotate',
  maximumRepetition: number,
  maximumQuizzes: number,
  maximumMCQs: number,
  showCardDurationSeconds: number,
  showNotifications: boolean,
  forbiddenUrls: string[],
}
