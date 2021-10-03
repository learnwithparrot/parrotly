import browser, { StorageValue, StorageObject } from 'webextension-polyfill';
import { StorageKeys } from './constants';

/**
 * Storage methods
 * TODO: We need to make some type of abstraction that will allow use to these connections
 * for graphQL subscriptions.
 */

export const setStorageItem = async <V extends StorageValue>(key: StorageKeys, value: V) => {
  const resp = browser.storage.local.set({ [key]: value });
  return resp;
};

interface GetItemArgs {
  storageKey: string;
}

// Helper functions to handle getting variables out of local storage
export const getStorageItem = async <T extends StorageObject>({ storageKey }: GetItemArgs) => {
  const result = (browser.storage.local.get(storageKey)) as T;
  return (result?.[storageKey] ?? null) as T[string] | null;
};
