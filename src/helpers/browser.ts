//import { browser } from "webextension-polyfill-ts";

declare var browser: any;

export function isWebExtension(): boolean {
  try {
    return !!browser;
  } catch(error) {
    return false;
  }
}

export function createTab(url: string, isActive: boolean = true): Promise<any> {
  return browser.tabs.create({
    url: url,
    active: isActive
  });
}

export function executeScript(tabId: number, code: string): void {
  browser.tabs.executeScript(
    tabId, {
      code: code
    }
  );
}

export function setBadgeText(text: string|number): void {
  browser.browserAction.setBadgeText({
    text: text === 0 ? '' : text.toString()
  });
}

export function setBadgeColors(backgroundColor: string, textColor: string): void {
  if (isFirefox()) {
    browser.browserAction.setBadgeTextColor({ color: textColor });
  }
  browser.browserAction.setBadgeBackgroundColor({ color: backgroundColor });
}

export function getBadgeText(): Promise<string> {
  return browser.browserAction.getBadgeText({});
}

export function isFirefox(): boolean {
  return navigator.userAgent.indexOf("Firefox") !== -1;
}

export function isChrome(): boolean {
  return navigator.userAgent.indexOf("Chrome") !== -1;
}
