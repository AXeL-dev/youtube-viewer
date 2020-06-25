const defaultVideosCheckRate = 30;
let totalRecentVideosCount = 0;
let checkedVideosIds = {};
function getAutoCheckRate() {
    return new Promise(async (resolve, reject) => {
        const [settings] = await getFromStorage('settings');
        resolve(settings.autoVideosCheckRate || defaultVideosCheckRate);
    });
}
function log(message, ...params) {
}
function getRecentVideosCount(channels, settings, cache) {
    return new Promise((resolve, reject) => {
        let count = 0;
        let notificationMessages = [];
        let promises = [];
        channels.filter((channel) => !channel.isHidden).forEach((channel) => {
            promises.push(getChannelActivities(channel.id, getDateBefore(settings.videosAnteriority)).then((results) => {
                var _a;
                log('activities of', channel.title, results);
                if (results === null || results === void 0 ? void 0 : results.items) {
                    const videosIds = results.items.map((item) => { var _a; return (_a = item.contentDetails.upload) === null || _a === void 0 ? void 0 : _a.videoId; }).filter((id) => id === null || id === void 0 ? void 0 : id.length);
                    const cacheVideosIds = ((_a = cache[channel.id]) === null || _a === void 0 ? void 0 : _a.length) ? cache[channel.id].map((video) => video.id) : [];
                    const recentVideosIds = videosIds.filter((videoId, index) => videosIds.indexOf(videoId) === index)
                        .slice(0, settings.videosPerChannel)
                        .filter((videoId) => !checkedVideosIds[channel.id] || checkedVideosIds[channel.id].indexOf(videoId) === -1)
                        .filter((videoId) => cacheVideosIds.indexOf(videoId) === -1);
                    if (recentVideosIds.length) {
                        log(recentVideosIds.length, 'recent videos');
                        if (!checkedVideosIds[channel.id]) {
                            checkedVideosIds[channel.id] = [];
                        }
                        checkedVideosIds[channel.id].push(...recentVideosIds);
                        const suffix = recentVideosIds.length > 1 ? 's' : '';
                        notificationMessages.push(`${channel.title} posted ${recentVideosIds.length} recent video${suffix}`);
                        count += recentVideosIds.length;
                    }
                    else {
                        log('no recent videos for this channel');
                    }
                }
            }).catch((error) => {
                console.error(error);
            }));
        });
        Promise.all(promises).finally(() => {
            resolve([count, notificationMessages]);
        });
    });
}
function autoCheckLoop(rate) {
    setTimeout(async () => {
        const [channels, settings, cache] = await getFromStorage('channels', 'settings', 'cache');
        log('Storage data:', { channels: channels, settings: settings, cache: cache });
        const [recentVideosCount, notificationMessages] = await getRecentVideosCount(channels, settings, cache);
        const badgeText = await getBadgeText();
        log('Recent videos count:', recentVideosCount);
        log('Badge text:', badgeText);
        if (badgeText.length) {
            totalRecentVideosCount += recentVideosCount;
        }
        else {
            totalRecentVideosCount = recentVideosCount;
        }
        log('Total count:', totalRecentVideosCount);
        setBadgeText(totalRecentVideosCount);
        if (settings.enableRecentVideosNotifications && recentVideosCount > 0) {
            notificationMessages.forEach((message) => {
                sendNotification(message);
            });
        }
        autoCheckLoop(settings.autoVideosCheckRate || defaultVideosCheckRate);
    }, rate * 60 * 1000);
}
async function init() {
    setBadgeColors('#666', '#fff');
    const rate = await getAutoCheckRate();
    log('Rate:', rate);
    autoCheckLoop(rate);
}
init();
