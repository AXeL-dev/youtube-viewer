import { Nullable } from 'types';
//import { browser } from "webextension-polyfill-ts";

declare var browser: any;

/**
 * Get data from storage
 *
 * e.g.: get('key1', 'key2', ...)
 *
 * @param keys
 */
async function get(...keys: string[]) {
  try {
    const result = await browser.storage.local.get(keys);
    return keys.length > 1 ? result : result[keys[0]];
  } catch (error) {
    const result: { [key: string]: string } = {};
    for (const key of keys) {
      const value = localStorage.getItem(key);
      result[key] = parse(value);
    }
    return keys.length > 1 ? result : result[keys[0]];
  }
}

function parse(value: Nullable<string>) {
  if (!value) {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
}

/**
 * Save data to storage
 *
 * e.g.: save({ key1: value1, key2: value2, ... })
 *
 * @param values
 */
function save(values: { [key: string]: any }) {
  try {
    browser.storage.local.set(values);
  } catch (error) {
    const keys = Object.keys(values);
    for (const key of keys) {
      const value = stringify(values[key]);
      localStorage.setItem(key, value);
    }
  }
}

function stringify(value: any) {
  try {
    return JSON.stringify(value);
  } catch (error) {
    return value;
  }
}

const storage = {
  get,
  save,
};

export default storage;
