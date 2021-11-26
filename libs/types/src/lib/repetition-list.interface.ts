import type { Language } from '@parrotly.io/constants'

export interface IRepetitionList {
  wordCount: number;
  wordsSample: { word: string, translation: string }[];
  numberOfFork: number;
  rating: number;
  id: string;
  public: boolean;
  default: boolean;
  name: string;
  creatorId: string;
  creatorDisplayName: string;
  creatorPhotoUrl: string;
  languageWord: Language,
  languageTranslation: Language,
}

export type RepetitionStyle = 'show' | 'mcq' | 'quiz'

export interface IRepetitionWord {
  word: string,
  translation: string,
  countShows: number,
  id?: string,
  countQuizzes: {
    passed: number,
    failed: number
  },
  countMCQs: {
    passed: number,
    failed: number
  },
  isExpression: boolean,
}

