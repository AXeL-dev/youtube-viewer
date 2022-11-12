(function () {
  const channelUrlById = {};

  function getChannelId(url) {
    if (url.includes('youtube.com/watch?v=') || url.includes('youtu.be/')) {
      return ytInitialPlayerResponse.microformat.playerMicroformatRenderer
        .externalChannelId;
    } else if (
      url.includes('youtube.com/channel/') ||
      url.includes('youtube.com/c/')
    ) {
      return ytInitialData.metadata.channelMetadataRenderer.externalId;
    } else {
      return null;
    }
  }

  function sendChannelId(data, delay = 0) {
    setTimeout(() => {
      const url = window.location.href;
      let channelId = getChannelId(url);
      if (channelId) {
        if (!channelUrlById[channelId]) {
          channelUrlById[channelId] = url;
        } else if (url !== channelUrlById[channelId]) {
          channelId = null;
        }
      }
      window.postMessage({
        from: 'page',
        response: {
          channelId,
        },
        ...data,
      });
    }, delay);
  }

  // listen to content script messages
  window.addEventListener('message', function (event) {
    const { from, request } = event.data;

    if (from !== 'content_script') {
      return;
    }

    switch (request.message) {
      case 'getChannelId':
        sendChannelId({ request });
        break;
      default:
        // ToDo: add commands to control the youtube player (play/stop video, update video link, etc...)
        break;
    }
  });

  // send channel id to content script on page load
  sendChannelId();

  // observe window location changes
  // Note: this doesn't work properly since getChannelId() only gets the initial channel id
  // & not the channel id of the currently played video
  let prevLocation = window.location.href;
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (prevLocation !== window.location.href) {
        prevLocation = window.location.href;
        sendChannelId();
      }
    });
  });

  const body = document.querySelector('body');
  observer.observe(body, {
    childList: true,
    subtree: true,
  });
})();
