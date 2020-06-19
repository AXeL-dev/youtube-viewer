//import { browser } from "webextension-polyfill-ts";

declare var browser: any;

/**
 * Get data from storage
 * 
 * EX: getFromStorage('key1', 'key2', ...)
 * 
 * @param keys 
 */
export function getFromStorage(...keys: string[]): Promise<any> {
  let promises: Promise<any>[] = [];
  keys.forEach((key: string) => {
    promises.push(__get(key));
  });
  return Promise.all(promises);
}

function __get(key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      browser.storage.local.get(key).then((storage: any) => {
        resolve(storage[key]);
      });
    }
    catch(error) {
      //console.log(error.message);
      const value: any = localStorage.getItem(key);
      let finalValue: any;
      try {
        finalValue = JSON.parse(value);
      }
      catch(error) {
        finalValue = value;
      }
      resolve(finalValue);
    }
  });
}

/**
 * Save data to storage
 * 
 * EX: saveToStorage({ key1: value1, key2: value2, ... })
 * 
 * @param values 
 */
export function saveToStorage(values: {[key: string]: any}): Promise<any> {
  let promises: Promise<any>[] = [];
  Object.keys(values).forEach((key: string) => {
    promises.push(__save(key, values[key]));
  });
  return Promise.all(promises);
}

function __save(key: string, value: any): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      browser.storage.local.set({[key]: value}).then(() => {
        resolve();
      });
    }
    catch(error) {
      //console.log(error.message);
      let finalValue: any;
      try {
        finalValue = JSON.stringify(value);
      }
      catch(error) {
        finalValue = value;
      }
      localStorage.setItem(key, finalValue);
      resolve();
    }
  });
}
