import { useEffect, useRef } from 'react';
import { isWebExtension, closeTabs, indexUrl } from 'helpers/webext';
import { addVideoFlag, removeVideoFlag } from 'store/reducers/videos';
import { Tab, ContextMenu } from 'types';
import { dispatch, useAppSelector } from 'store';
import {
  selectViewedVideos,
  selectWatchLaterVideos,
} from 'store/selectors/videos';
import { getVideoId } from 'helpers/utils';
import { fetchChannelById } from 'store/thunks';

declare var browser: any;

interface ContextMenusProps {}

interface ContextMenuUpdateOptions {
  enabled?: boolean;
  checked?: boolean;
}

const menus: ContextMenu[] = [
  {
    title: 'Add video to watch later list',
    id: 'add_video_to_watch_later_list',
    enabled: false,
    contexts: ['page'],
  },
  {
    title: 'Mark video as viewed',
    id: 'mark_video_as_viewed',
    type: 'checkbox',
    enabled: false,
    checked: false,
    contexts: ['page'],
  },
];

export default function ContextMenus(props: ContextMenusProps) {
  const watchLaterVideos = useAppSelector(selectWatchLaterVideos());
  const viewedVideos = useAppSelector(selectViewedVideos());
  const ports = useRef<any[]>([]);

  const handleConnect = (p: any) => {
    ports.current[p.sender.tab.id] = p;
    p.onMessage.addListener((message: any) => {
      const { menuItemId, checked } = message.request;
      const { videoId: id, channelId, datePublished } = message.response;
      const video = {
        id,
        channelId,
        publishedAt: new Date(datePublished).getTime(),
      };
      switch (menuItemId) {
        case 'add_video_to_watch_later_list':
          closeTabs((tab) => tab.url.startsWith(indexUrl)).then(() => {
            dispatch(
              addVideoFlag({
                video,
                flag: 'toWatchLater',
              }),
              true,
            );
            // ensure to add channel too (if it does not exist)
            dispatch(fetchChannelById({ id: channelId }), true);
            browser.contextMenus.update(menuItemId, { enabled: false });
          });
          break;
        case 'mark_video_as_viewed': {
          closeTabs((tab) => tab.url.startsWith(indexUrl)).then(() => {
            if (checked) {
              dispatch(
                addVideoFlag({
                  video,
                  flag: 'viewed',
                }),
                true,
              );
              // ensure to add channel too (if it does not exist)
              dispatch(fetchChannelById({ id: channelId }), true);
            } else {
              dispatch(
                removeVideoFlag({
                  video: { id },
                  flag: 'viewed',
                }),
                true,
              );
            }
          });
          break;
        }
      }
    });
  };

  const handleContextMenusClick = (info: any, tab: Tab) => {
    switch (info.menuItemId) {
      case 'add_video_to_watch_later_list':
      case 'mark_video_as_viewed': {
        const port = ports.current[tab.id];
        if (port) {
          port.postMessage({
            message: 'getVideoInfos',
            menuItemId: info.menuItemId,
            checked: info.checked,
            // url: info.pageUrl,
          });
        }
        break;
      }
    }
  };

  const handleTabActivate = (activeInfo: any) => {
    updateContextMenus(activeInfo.tabId);
  };

  const handleTabUpdate = (tabId: number, changeInfo: any, tab: Tab) => {
    updateContextMenus(tabId);
  };

  const parseUrl = (url: string) => {
    const data: {
      isYoutubeVideo: boolean;
      videoId: string | null;
    } = {
      isYoutubeVideo: false,
      videoId: null,
    };
    if (url?.includes('youtube.com/watch?v=') || url?.includes('youtu.be/')) {
      data.isYoutubeVideo = true;
      data.videoId = getVideoId(url);
    }
    return data;
  };

  const updateContextMenus = (tabId: number) => {
    browser.tabs.get(tabId).then((tab: Tab) => {
      const { isYoutubeVideo, videoId } = parseUrl(tab.url);
      for (const menu of menus) {
        const options: ContextMenuUpdateOptions = {
          enabled: isYoutubeVideo,
        };
        if (menu.type === 'checkbox') {
          options.checked = false;
        }
        if (options.enabled && videoId) {
          switch (menu.id) {
            case 'add_video_to_watch_later_list': {
              const found = watchLaterVideos.find(
                (video) => video.id === videoId,
              );
              options.enabled = !found;
              break;
            }
            case 'mark_video_as_viewed': {
              const found = viewedVideos.find((video) => video.id === videoId);
              options.checked = !!found;
              break;
            }
          }
        }
        browser.contextMenus.update(menu.id, options);
      }
    });
  };

  const createContextMenus = () => {
    for (const menu of menus) {
      browser.contextMenus.create(menu);
    }
  };

  useEffect(() => {
    if (!isWebExtension) {
      return;
    }
    createContextMenus();
    // Handle context menu click
    browser.contextMenus.onClicked.addListener(handleContextMenusClick);
    // Handle content script connection
    browser.runtime.onConnect.addListener(handleConnect);

    return () => {
      browser.contextMenus.onClicked.removeListener(handleContextMenusClick);
      browser.runtime.onConnect.removeListener(handleConnect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isWebExtension) {
      return;
    }
    // Handle tabs events
    browser.tabs.onActivated.addListener(handleTabActivate);
    browser.tabs.onUpdated.addListener(handleTabUpdate);

    return () => {
      browser.tabs.onActivated.removeListener(handleTabActivate);
      browser.tabs.onUpdated.removeListener(handleTabUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchLaterVideos, viewedVideos]);

  return null;
}
