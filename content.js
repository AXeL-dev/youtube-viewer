/* global browser, chrome */

(function () {
  function getMeta(name) {
    const query = document.querySelector('meta[itemprop="' + name + '"]');
    return query ? query.content : undefined;
  }

  function getVideoId(url) {
    let videoId = null;
    if (url.indexOf('v=') !== -1) {
      /**
       * Example:
       *    https://www.youtube.com/watch?v=aZ-dSpfdHok
       *    https://www.youtube.com/watch?v=aZ-dSpfdHok&feature=feedrec_grec_index
       */
      videoId = url.split('v=')[1];
      const index = videoId.indexOf('&');
      if (index !== -1) {
        videoId = videoId.substring(0, index);
      }
    } else if (url.indexOf('/') !== -1) {
      /**
       * Example:
       *    https://youtu.be/aZ-dSpfdHok
       *    https://youtu.be/PqkaBUmJpq8?list=PLmmPGQQTKzSZSPd3pa6q9UQ-PkeCx1fam
       */
      const link = url.split('?')[0];
      const params = link.split('/');
      videoId = params[params.length - 1];
    }
    return videoId;
  }

  function handleMessage(request, sender) {
    switch (request.message) {
      case 'getVideoInfos': {
        const videoId = getMeta('videoId') || getVideoId(window.location.href);
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

  const port = browserAPI.runtime.connect({ name: 'youtube-viewer-cs' });
  port.onMessage.addListener(handleMessage);
})();
