/* global browser */

(function () {
  // listen to background page messages
  const port = browser.runtime.connect({ name: 'youtube-viewer-cs' });
  port.onMessage.addListener(function (request) {
    window.postMessage({ from: 'content_script', request });
  });

  // inject window listener script
  const script = document.createElement('script');
  script.src = browser.runtime.getURL('listener.js');
  script.onload = function () {
    this.remove();
  };
  (document.head || document.documentElement).appendChild(script);

  // listen to window messages
  window.addEventListener('message', function (event) {
    const { from, request, response } = event.data;

    if (from !== 'page') {
      return;
    }

    port.postMessage({
      request,
      response,
    });
  });
})();
