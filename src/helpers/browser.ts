//import { browser } from "webextension-polyfill-ts";

declare var browser: any;

export function isWebExtension(): boolean {
  try {
    return !!browser;
  } catch(error) {
    return false;
  }
}

export function createTab(url: string, active: boolean = true): Promise<any> {
  return browser.tabs.create({
    url: url,
    active: active
  });
}

export function executeScript(tabId: number, code: string) {
  browser.tabs.executeScript(
    tabId, {
      code: code
    }
  );
}
