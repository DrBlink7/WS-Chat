import { effect } from "./f";
import { key } from "./config";
import CryptoJS from "crypto-js";

type LocalStorageMap = {
  store: State;
  archived: Record<string, MessageStatus>;
};

export const set = <K extends keyof LocalStorageMap>(
  key: K,
  value: LocalStorageMap[K]
) => localStorage.setItem(key, encryptData(value));

export const has = (key: keyof LocalStorageMap): boolean =>
  localStorage.getItem(key) ? true : false;

export const get = <K extends keyof LocalStorageMap>(
  key: K
): LocalStorageMap[K] | null => {
  const value = localStorage.getItem(key);

  if (!value) return null;

  try {
    return decryptData(value);
  } catch {
    return value as never;
  }
};

export const del = (key: keyof LocalStorageMap): void =>
  localStorage.removeItem(key);

export const clear = () => localStorage.clear();

export const cache = <K extends keyof LocalStorageMap>(
  key: K,
  fetch: () => Promise<LocalStorageMap[K]>
): Promise<LocalStorageMap[K]> => {
  const cached = get(key);

  return cached
    ? Promise.resolve<LocalStorageMap[K]>(cached)
    : fetch().then(effect((x) => set(key, x)));
};

const encryptData = <K extends keyof LocalStorageMap>(
  data: LocalStorageMap[K]
) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    key
  ).toString();

  return encryptedData;
};

const decryptData = (encryptedData: string) => {
  const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
  const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

  return decryptedData;
};
