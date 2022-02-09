/* global browser, chrome */

(function () {
  function getMeta(name) {
    return document.querySelector('meta[itemprop="' + name + '"]').content;
  }

  function handleMessage(request, sender) {
    switch (request.message) {
      case 'getVideoInfos': {
        const videoId = getMeta('videoId');
        const channelId = getMeta('channelId');
        const datePublished = getMeta('datePublished');
        port.postMessage({
          request,
          response: {
            videoId,
            channelId,
            datePublished,
          },
        });
        break;
      }
      default:
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

  const port = browserAPI.runtime.connect({ name: 'cs-port' });
  port.onMessage.addListener(handleMessage);
})();
