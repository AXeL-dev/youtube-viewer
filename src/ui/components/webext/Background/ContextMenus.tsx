import { useEffect, useRef } from 'react';
import { isWebExtension, closeExtensionTabs } from 'helpers/webext';
import { removeVideoFlag } from 'store/reducers/videos';
import { Tab, ContextMenu, ContextMenuInfo } from 'types';
import { dispatch } from 'store';
import {
  selectBookmarkedVideos,
  selectSeenVideos,
  selectWatchLaterVideos,
} from 'store/selectors/videos';
import { getVideoId } from 'helpers/utils';
import { addVideoById } from 'store/thunks/videos';
import { selectChannels } from 'store/selectors/channels';
import { addChannelById } from 'store/thunks/channels';
import { useSelectorRef } from 'hooks';

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
    title: 'Add video to bookmarks list',
    id: 'add_video_to_bookmarks_list',
    enabled: false,
    contexts: ['page'],
  },
  {
    title: 'Mark video as seen',
    id: 'mark_video_as_seen',
    type: 'checkbox',
    enabled: false,
    checked: false,
    contexts: ['page'],
  },
  {
    title: 'Add channel',
    id: 'add_channel',
    enabled: false,
    contexts: ['page'],
  },
];

export default function ContextMenus(props: ContextMenusProps) {
  const watchLaterVideosRef = useSelectorRef(selectWatchLaterVideos());
  const bookmarkedVideosRef = useSelectorRef(selectBookmarkedVideos());
  const seenVideosRef = useSelectorRef(selectSeenVideos());
  const channelsRef = useSelectorRef(selectChannels);
  const channelIdsRef = useRef<{ [key: string]: string }>({}); // tab id: channel id
  const portsRef = useRef<{ [key: string]: any }>({}); // tab id: port

  const handleConnect = (port: any) => {
    portsRef.current[port.sender.tab.id] = port;
    port.onMessage.addListener((message: any) => {
      // const { menuItemId, checked } = message.request;
      const { channelId } = message.response;
      const options: ContextMenuUpdateOptions = { enabled: false };
      if (channelId) {
        channelIdsRef.current[port.sender.tab.id] = channelId;
        const found = channelsRef.current.find(
          (channel) => channel.id === channelId,
        );
        options.enabled = !found;
      }
      browser.contextMenus.update('add_channel', options);
    });
  };

  const handleContextMenusClick = (info: ContextMenuInfo, tab: Tab) => {
    const { videoId, channelId } = parseTabUrl(tab);
    if (['add_channel'].includes(info.menuItemId) && channelId) {
      handleChannelActions(info, channelId);
    } else if (videoId) {
      handleVideoActions(info, videoId);
    }
  };

  const handleVideoActions = (info: ContextMenuInfo, videoId: string) => {
    switch (info.menuItemId) {
      case 'add_video_to_watch_later_list':
        closeExtensionTabs().then(() => {
          browser.contextMenus.update(info.menuItemId, { enabled: false });
          dispatch(
            addVideoById({
              id: videoId,
              flags: { toWatchLater: true },
            }),
            true,
          );
        });
        break;
      case 'add_video_to_bookmarks_list':
        closeExtensionTabs().then(() => {
          browser.contextMenus.update(info.menuItemId, { enabled: false });
          dispatch(
            addVideoById({
              id: videoId,
              flags: { bookmarked: true },
              hideChannel: true,
            }),
            true,
          );
        });
        break;
      case 'mark_video_as_seen': {
        closeExtensionTabs().then(() => {
          if (info.checked) {
            dispatch(
              addVideoById({
                id: videoId,
                flags: { seen: true },
              }),
              true,
            );
          } else {
            dispatch(
              removeVideoFlag({
                video: { id: videoId },
                flag: 'seen',
              }),
              true,
            );
          }
        });
        break;
      }
    }
  };

  const handleChannelActions = (info: ContextMenuInfo, channelId: string) => {
    switch (info.menuItemId) {
      case 'add_channel':
        closeExtensionTabs().then(() => {
          browser.contextMenus.update(info.menuItemId, { enabled: false });
          dispatch(
            addChannelById({
              id: channelId,
            }),
            true,
          );
        });
        break;
    }
  };

  const handleTabActivate = (activeInfo: any) => {
    updateContextMenus(activeInfo.tabId);
  };

  const handleTabUpdate = (tabId: number, changeInfo: any, tab: Tab) => {
    updateContextMenus(tabId);
  };

  const parseTabUrl = (tab: Tab) => {
    const data: {
      isYoutubeVideo: boolean;
      videoId: string | null;
      isYoutubeChannel: boolean;
      channelId: string | null;
    } = {
      isYoutubeVideo: false,
      videoId: null,
      isYoutubeChannel: false,
      channelId: null,
    };
    if (
      tab.url?.includes('youtube.com/watch?v=') ||
      tab.url?.includes('youtu.be/')
    ) {
      data.isYoutubeVideo = true;
      data.videoId = getVideoId(tab.url);
      data.channelId = channelIdsRef.current[tab.id];
    } else if (
      tab.url?.includes('youtube.com/channel/') ||
      tab.url?.includes('youtube.com/c/')
    ) {
      data.isYoutubeChannel = true;
      // data.channelId = getChannelId(tab.url);
      data.channelId = channelIdsRef.current[tab.id];
    }
    return data;
  };

  const updateContextMenus = (tabId: number) => {
    browser.tabs.get(tabId).then((tab: Tab) => {
      const { isYoutubeVideo, videoId, isYoutubeChannel, channelId } =
        parseTabUrl(tab);
      for (const menu of menus) {
        const options: ContextMenuUpdateOptions = {
          enabled:
            menu.id === 'add_channel'
              ? (isYoutubeChannel || isYoutubeVideo) && !!channelId
              : isYoutubeVideo && !!videoId,
        };
        if (menu.type === 'checkbox') {
          options.checked = false;
        }
        if (options.enabled) {
          switch (menu.id) {
            case 'add_video_to_watch_later_list': {
              const found = watchLaterVideosRef.current.find(
                (video) => video.id === videoId,
              );
              options.enabled = !found;
              break;
            }
            case 'add_video_to_bookmarks_list': {
              const found = bookmarkedVideosRef.current.find(
                (video) => video.id === videoId,
              );
              options.enabled = !found;
              break;
            }
            case 'mark_video_as_seen': {
              const found = seenVideosRef.current.find(
                (video) => video.id === videoId,
              );
              options.checked = !!found;
              break;
            }
            case 'add_channel': {
              const found = channelsRef.current.find(
                (channel) => channel.id === channelId,
              );
              options.enabled = !found;
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
  }, []);

  return null;
}
