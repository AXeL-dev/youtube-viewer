/* global browser, chrome */

(function () {
  function handleMessage(request, sender) {
    switch (request.message) {
      default:
        // ToDo: add commands to control the youtube player (play/stop video, update video link, etc...)
        break;
    }
  }

  const browserAPI = (function () {
    try {
      return browser;
    } catch (e) {
      return chrome;
    }
  })();

  const port = browserAPI.runtime.connect({ name: 'youtube-viewer-cs' });
  port.onMessage.addListener(handleMessage);
})();
