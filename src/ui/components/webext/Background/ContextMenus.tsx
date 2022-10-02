import { useEffect } from 'react';
import { isWebExtension, closeExtensionTabs } from 'helpers/webext';
import { removeVideoFlag } from 'store/reducers/videos';
import { Tab, ContextMenu, ContextMenuInfo } from 'types';
import { dispatch, useAppSelector } from 'store';
import {
  selectBookmarkedVideos,
  selectSeenVideos,
  selectWatchLaterVideos,
} from 'store/selectors/videos';
import { getVideoId } from 'helpers/utils';
import { addVideoById } from 'store/thunks/videos';

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
];

export default function ContextMenus(props: ContextMenusProps) {
  const watchLaterVideos = useAppSelector(selectWatchLaterVideos());
  const bookmarkedVideos = useAppSelector(selectBookmarkedVideos());
  const seenVideos = useAppSelector(selectSeenVideos());

  const handleContextMenusClick = (info: ContextMenuInfo, tab: Tab) => {
    const { videoId: id } = parseUrl(tab.url);
    if (!id) {
      return;
    }
    switch (info.menuItemId) {
      case 'add_video_to_watch_later_list':
        closeExtensionTabs().then(() => {
          browser.contextMenus.update(info.menuItemId, { enabled: false });
          dispatch(
            addVideoById({
              id,
              flags: {
                toWatchLater: true,
              },
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
              id,
              flags: {
                bookmarked: true,
              },
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
                id,
                flags: {
                  seen: true,
                },
              }),
              true,
            );
          } else {
            dispatch(
              removeVideoFlag({
                video: { id },
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
            case 'add_video_to_bookmarks_list': {
              const found = bookmarkedVideos.find(
                (video) => video.id === videoId,
              );
              options.enabled = !found;
              break;
            }
            case 'mark_video_as_seen': {
              const found = seenVideos.find((video) => video.id === videoId);
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

    return () => {
      browser.contextMenus.onClicked.removeListener(handleContextMenusClick);
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
  }, [watchLaterVideos, seenVideos]);

  return null;
}
