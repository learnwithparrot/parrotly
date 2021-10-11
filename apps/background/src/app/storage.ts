import browser, { StorageValue, StorageObject } from 'webextension-polyfill';
import { StorageKeys } from './constants';

export const setStorageItem = async <V extends StorageValue>(key: StorageKeys, value: V) => {
  const resp = await browser.storage.local.set({ [key]: value });
  return resp;
};

interface GetItemArgs {
  storageKey: string;
}

// Helper functions to handle getting variables out of local storage
export const getStorageItem = async <T extends StorageObject>({ storageKey }: GetItemArgs) => {
  const result = (await browser.storage.local.get(storageKey)) as T;
  return (result?.[storageKey] ?? null) as T[string] | null;
};
