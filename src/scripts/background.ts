import { Channel } from '../models/Channel';
import { Settings } from '../models/Settings';
import { Video } from '../models/Video';
import { getFromStorage } from '../helpers/storage';
import { getDateBefore } from '../helpers/utils';
import { getChannelActivities } from '../helpers/youtube';
import { setBadgeText, setBadgeColors, getBadgeText, sendNotification } from '../helpers/browser';

const defaultVideosCheckRate: number = 30;

function getAutoCheckRate(): Promise<number> {
  return new Promise(async (resolve, reject) => {
    const [settings] = await getFromStorage('settings');
    resolve(settings.autoVideosCheckRate || defaultVideosCheckRate);
  });
}

function log(message: any, ...params: any) {
  //console.log(message, ...params); // comment/uncomment this to manually enable/disable logs
}

function getRecentVideosCount(channels: Channel[], settings: Settings, cache: any): Promise<[number, string[]]> {

  return new Promise((resolve, reject) => {

    let count: number = 0;
    let notificationMessages: string[] = [];
    let promises: Promise<any>[] = [];

    channels.filter((channel) => !channel.isHidden).forEach((channel) => {

      promises.push(
        getChannelActivities(channel.id, getDateBefore(settings.videosAnteriority)).then((results) => {
          log('activities of', channel.title, results);
          if (results?.items) {
            // get recent videos ids
            const videoIds: string[] = results.items.map((item: any) => item.contentDetails.upload?.videoId).filter((id: string) => id?.length);
            const cacheVideoIds: string[] = cache[channel.id]?.length ? cache[channel.id].map((video: Video) => video.id) : [];
            const recentVideoIds: string[] = videoIds.filter((videoId: string, index: number) => videoIds.indexOf(videoId) === index) // remove duplicates
                                                    .slice(0, settings.videosPerChannel)
                                                    .filter((videoId: string) => cacheVideoIds.indexOf(videoId) === -1); // no need to refetch videos already in cache
            // set recent videos count
            if (recentVideoIds.length) {
              log(recentVideoIds.length, 'recent videos');
              notificationMessages.push(`${channel.title} posted ${recentVideoIds.length} recent videos.`);
              count += recentVideoIds.length;
            } else {
              log('no recent videos for this channel');
            }
          }
        }).catch((error: Error) => {
          console.error(error);
        })
      );

    });

    Promise.all(promises).finally(() => {
      resolve([count, notificationMessages]);
    });

  });

}

async function autoCheckLoop(rate?: number) {
  if (!rate) {
    rate = await getAutoCheckRate();
    log('Rate:', rate);
  }
  let totalRecentVideosCount: number = 0;
  setTimeout(async () => {
    // Get storage data
    const [channels, settings, cache] = await getFromStorage('channels', 'settings', 'cache');
    log('Storage data:', { channels: channels, settings: settings, cache: cache });
    // Check for recent videos
    const [recentVideosCount, notificationMessages] = await getRecentVideosCount(channels, settings, cache);
    const badgeText: string = await getBadgeText();
    log('Recent videos count:', recentVideosCount);
    log('Badge text:', badgeText);
    if (badgeText.length) { // if badge text wasn't reseted yet (means that the user didn't yet notice it), we increment the total count
      totalRecentVideosCount += recentVideosCount;
    } else {
      totalRecentVideosCount = recentVideosCount;
    }
    log('Total count:', totalRecentVideosCount);
    setBadgeText(totalRecentVideosCount);
    // Notify
    if (settings.enableRecentVideosNotifications && recentVideosCount > 0) {
      notificationMessages.forEach((message: string) => {
        sendNotification(message);
      });
    }
    // Re-loop
    autoCheckLoop(settings.autoVideosCheckRate || defaultVideosCheckRate);
  }, rate * 60 * 1000); // convert minutes to milliseconds
}

function init() {
  setBadgeColors('#666', '#fff');
  autoCheckLoop();
}

init();
