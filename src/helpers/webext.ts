// import { browser } from "webextension-polyfill-ts";
import {
  SendNotificationParams,
  BadgeColors,
  OpenTabOptions,
  TabResolver,
} from 'types';

declare var browser: any;

export const isWebExtension: boolean = (() => {
  try {
    return !!browser;
  } catch (error) {
    return false;
  }
})();

export function isPopup(): boolean {
  // have to be a function not a const, 'cause we need to check the window size multiple times not only once
  return window.innerWidth < 1000;
}

export function isFirefox(): boolean {
  return navigator.userAgent.indexOf('Firefox') !== -1;
}

export function isChrome(): boolean {
  return navigator.userAgent.indexOf('Chrome') !== -1;
}

export const indexUrl = isWebExtension ? getUrl('index.html') : '';

export function createTab(url: string, isActive: boolean = true): Promise<any> {
  return browser.tabs.create({
    url,
    active: isActive,
  });
}

export function openPage(page: string, reloadIfExists: boolean = true) {
  const pageUrl = `${indexUrl}#/${page?.replace(/^\//, '') || ''}`;
  return tryOpenTab(pageUrl, {
    reloadIfExists,
    resolver: (tab) => tab.url.startsWith(indexUrl),
  });
}

export async function tryOpenTab(url: string, options: OpenTabOptions = {}) {
  options = {
    resolver: (tab) => tab.url === url,
    ...options,
  };

  if (!options.reloadIfExists) {
    return createTab(url);
  }

  const tabs = await browser.tabs.query({});
  if (tabs.length > 0) {
    for (const tab of tabs) {
      if (options.resolver!(tab)) {
        await browser.tabs.update(tab.id, {
          url,
          active: true,
        });
        browser.tabs.reload(tab.id);
        return tab;
      }
    }
  }

  return createTab(url);
}

export async function closeTabs(resolver: TabResolver) {
  const closedTabs = [];
  const tabs = await browser.tabs.query({});
  if (tabs.length > 0) {
    for (const tab of tabs) {
      if (resolver(tab)) {
        browser.tabs.remove(tab.id);
        closedTabs.push(tab);
      }
    }
  }

  return closedTabs;
}

export function getUrl(path: string): string {
  return browser.runtime.getURL(path);
}

export function executeScript(tabId: number, code: string): void {
  browser.tabs.executeScript(tabId, {
    code,
  });
}

// Notes:
// - id will be auto-generated if empty
// - Firefox only supports the 'basic' type @see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/notifications/TemplateType#type
export function sendNotification(params: SendNotificationParams): void {
  const {
    id,
    type = 'basic',
    title = 'YouTube viewer',
    iconUrl = 'icons/128.png',
    ...rest
  } = params;
  browser.notifications.create(id, {
    type,
    title,
    iconUrl,
    ...rest,
  });
}

export function sendMessage(message: string, ...params: any) {
  return browser.runtime.sendMessage({
    message,
    params,
  });
}

export function setBadgeText(text: string | number): void {
  browser.browserAction.setBadgeText({
    text: text === 0 ? '' : text.toString(),
  });
}

export function setBadgeColors({
  backgroundColor,
  textColor,
}: BadgeColors): void {
  if (isFirefox()) {
    browser.browserAction.setBadgeTextColor({ color: textColor });
  }
  browser.browserAction.setBadgeBackgroundColor({ color: backgroundColor });
}

export function getBadgeText(): Promise<string> {
  return browser.browserAction.getBadgeText({});
}
