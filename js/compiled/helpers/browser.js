function isWebExtension() {
    try {
        return !!browser;
    }
    catch (error) {
        return false;
    }
}
function createTab(url, isActive = true) {
    return browser.tabs.create({
        url: url,
        active: isActive
    });
}
function executeScript(tabId, code) {
    browser.tabs.executeScript(tabId, {
        code: code
    });
}
function sendNotification(message, type = 'basic') {
    browser.notifications.create({
        type: type,
        title: 'Youtube viewer',
        iconUrl: 'icons/128.png',
        message: message
    });
}
function setBadgeText(text) {
    browser.browserAction.setBadgeText({
        text: text === 0 ? '' : text.toString()
    });
}
function setBadgeColors(backgroundColor, textColor) {
    if (isFirefox()) {
        browser.browserAction.setBadgeTextColor({ color: textColor });
    }
    browser.browserAction.setBadgeBackgroundColor({ color: backgroundColor });
}
function getBadgeText() {
    return browser.browserAction.getBadgeText({});
}
function isFirefox() {
    return navigator.userAgent.indexOf("Firefox") !== -1;
}
function isChrome() {
    return navigator.userAgent.indexOf("Chrome") !== -1;
}
