import React from 'react';
import { Channel } from '../models/Channel';
import { Settings } from '../models/Settings';
import { Video } from '../models/Video';
import { getFromStorage } from '../helpers/storage';
import { getDateBefore } from '../helpers/utils';
import { getChannelActivities } from '../helpers/youtube';
import { isWebExtension, setBadgeText, setBadgeColors, getBadgeText, sendNotification, createTab } from '../helpers/browser';
import { Notification } from '../models/Notification';

declare var browser: any;

const defaults: any = {
  videosCheckRate: 30, // minute(s)
  videosAnteriority: 1, // day(s)
  videosPerChannel: 9,
};

interface BackgroundProps {}

interface BackgroundState {
  totalRecentVideosCount: number;
  checkedChannels: {
    [key: string]: { // key == channel.id
      videosIds: string[],
      url: string
    }
  };
}

class Background extends React.Component<BackgroundProps, BackgroundState> {
  constructor(props: BackgroundProps) {
    super(props);
    this.state = {
      totalRecentVideosCount: 0,
      checkedChannels: {}
    };
    if (isWebExtension()) {
      this.init();
      console.log('background init executed.');
    }
  }

  async init() {
    setBadgeColors('#666', '#fff');
    const rate = await this.getAutoCheckRate();
    this.log('Rate:', rate);
    this.autoCheckLoop(rate);
    // Handle click on notifications
    browser.notifications.onClicked.addListener((notificationId: string) => {
      this.log('Notification clicked:', notificationId);
      const [ , id ] = notificationId.split('::');
      const url = this.state.checkedChannels[id]?.url;
      if (url?.length) {
        createTab(url);
      }
    });
  }

  log(message: any, ...params: any) {
    //console.log(message, ...params); // comment/uncomment this to manually enable/disable logs
  }

  autoCheckLoop(rate: number) {
    setTimeout(async () => {
      // Get storage data
      const [channels, settings, cache] = await getFromStorage('channels', 'settings', 'cache');
      this.log('Storage data:', { channels: channels, settings: settings, cache: cache });
      // Check for recent videos
      const [recentVideosCount, notifications] = await this.getRecentVideosCount(channels, settings, cache);
      const badgeText: string = await getBadgeText();
      let { totalRecentVideosCount } = this.state;
      this.log('Recent videos count:', recentVideosCount);
      this.log('Badge text:', badgeText);
      if (badgeText.length) { // if badge text wasn't reseted yet (means that the user didn't yet notice it), we increment the total count
        totalRecentVideosCount += recentVideosCount;
      } else {
        totalRecentVideosCount = recentVideosCount;
      }
      this.setState({ totalRecentVideosCount: totalRecentVideosCount });
      this.log('Total count:', totalRecentVideosCount);
      setBadgeText(totalRecentVideosCount);
      // Notify
      if (settings?.enableRecentVideosNotifications && recentVideosCount > 0) {
        notifications.forEach((notification: Notification) => {
          const id = notification.id?.length ? new Date().getTime() + '::' + notification.id : '';
          sendNotification(notification.message, id);
        });
      }
      // Re-loop
      this.autoCheckLoop(settings?.autoVideosCheckRate || defaults.videosCheckRate);
    }, rate * 60 * 1000); // convert minutes to milliseconds
  }

  getAutoCheckRate(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const [settings] = await getFromStorage('settings');
      resolve(settings?.autoVideosCheckRate || defaults.videosCheckRate);
    });
  }

  getRecentVideosCount(channels: Channel[], settings: Settings, cache: any): Promise<[number, Notification[]]> {

    return new Promise((resolve, reject) => {
  
      let count: number = 0;
      let notifications: Notification[] = [];
      let promises: Promise<any>[] = [];
      let { checkedChannels } = this.state;
  
      channels.filter((channel: Channel) => !channel.isHidden && !channel.notificationsDisabled).forEach((channel) => {
  
        promises.push(
          getChannelActivities(channel.id, getDateBefore(defaults.videosAnteriority)).then((results) => {
            this.log('activities of', channel.title, results);
            if (results?.items) {
              // get recent videos ids
              const videosIds: string[] = results.items.map((item: any) => item.contentDetails.upload?.videoId).filter((id: string) => id?.length);
              const cacheVideosIds: string[] = cache[channel.id]?.length ? cache[channel.id].map((video: Video) => video.id) : [];
              const recentVideosIds: string[] = videosIds.filter((videoId: string, index: number) => videosIds.indexOf(videoId) === index) // remove duplicates
                                                         .slice(0, settings?.videosPerChannel || defaults.videosPerChannel)
                                                         .filter((videoId: string) => !checkedChannels[channel.id] || checkedChannels[channel.id].videosIds.indexOf(videoId) === -1) // remove videos already checked
                                                         .filter((videoId: string) => cacheVideosIds.indexOf(videoId) === -1); // remove videos already in cache
              // set recent videos count
              if (recentVideosIds.length) {
                this.log(recentVideosIds.length, 'recent videos');
                // update checked videos ids
                if (!checkedChannels[channel.id]) {
                  checkedChannels[channel.id] = {
                    videosIds: [],
                    url: channel.url
                  };
                }
                checkedChannels[channel.id].videosIds.push(...recentVideosIds);
                // generate notification messages
                const suffix = recentVideosIds.length > 1 ? 's' : '';
                notifications.push({
                  message: `${channel.title} posted ${recentVideosIds.length} recent video${suffix}`,
                  id: channel.id
                });
                // update count
                count += recentVideosIds.length;
              } else {
                this.log('no recent videos for this channel');
              }
            }
          }).catch((error: Error) => {
            console.error(error);
          })
        );
  
      });
  
      Promise.all(promises).finally(() => {
        this.setState({ checkedChannels: checkedChannels });
        resolve([count, notifications]);
      });
  
    });
  
  }

  render() {
    return (
      <span>Silence is golden!</span>
    );
  }
}

export default Background;
