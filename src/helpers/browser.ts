//import { browser } from "webextension-polyfill-ts";

declare var browser: any;

function isBrowserAPIAvailable(): boolean {
  try {
    return !!browser;
  } catch(error) {
    return false;
  }
}

export const isWebExtension: boolean = isBrowserAPIAvailable();

export function isPopup(): boolean { // have to be a function not a const, 'cause we need to check the window size multiple times not only once
  return window.innerWidth < 1000;
}

export function createTab(url: string, isActive: boolean = true): Promise<any> {
  return browser.tabs.create({
    url: url,
    active: isActive
  });
}

export function getUrl(path: string): string {
  return browser.extension.getURL(path);
}

export function executeScript(tabId: number, code: string): void {
  browser.tabs.executeScript(
    tabId, {
      code: code
    }
  );
}

export function sendNotification(message: string, id?: string, type: string|any = 'basic'): void { // id will be auto-generated if empty
  browser.notifications.create(id, {
    type: type,
    title: 'Youtube viewer',
    iconUrl: 'icons/128.png',
    message: message
  });
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
