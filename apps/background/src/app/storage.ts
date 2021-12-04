import browser, { StorageValue, StorageObject } from 'webextension-polyfill';
import { StorageKeys } from './constants';
interface GetItemArgs {
  storageKey: string;
}

export const setStorageItem = async <V extends StorageValue>(key: StorageKeys, value: V) => {
  const resp = await browser.storage.local.set({ [key]: value });
  return resp;
};

// Helper functions to handle getting variables out of local storage
export const getStorageItem = async <T extends StorageObject>({ storageKey }: GetItemArgs) => {
  const result = (await browser.storage.local.get(storageKey)) as T;
  return (result?.[storageKey] ?? null) as T[string] | null;
};

// returns a promise which resolves with nothing in case of success and rejects the promise otherwise.
export const removeStorageItem = async (key:string) => {
  return browser.storage.local.remove(key);
};
