import { atom } from 'jotai';
import { Video, VideosSortOrder, ChannelSelection, SortOrder } from '../models';

export const videosAtom = atom([] as Video[]);

export const defaultVideosSortOrder: SortOrder = SortOrder.DESC;

export const videosSortOrderAtom = atom({
  [ChannelSelection.All]: SortOrder.DESC,
  [ChannelSelection.TodaysVideos]: SortOrder.DESC,
  [ChannelSelection.RecentVideos]: SortOrder.DESC,
  [ChannelSelection.WatchLaterVideos]: SortOrder.ASC
} as VideosSortOrder);

export const setVideosSortOrderAtom = atom( // write-only
  null,
  (get, set, args: VideosSortOrder) => {
    set(videosSortOrderAtom, {
      ...get(videosSortOrderAtom),
      ...args
    });
  }
);
