let apiKey = 'AIzaSyB6mi40O6WOd17yjeYkK-y5lIU4FvoR8fo';
const apiRequest = (() => {
    async function setApiKey() {
        var _a;
        const [settings] = await getFromStorage('settings');
        apiKey = ((_a = settings === null || settings === void 0 ? void 0 : settings.apiKey) === null || _a === void 0 ? void 0 : _a.length) ? settings.apiKey : apiKey;
    }
    async function makeRequest(url) {
        var _a;
        let response = await window.fetch(url);
        if (!response.ok) {
            const json = await response.json();
            throw Error(((_a = json === null || json === void 0 ? void 0 : json.error) === null || _a === void 0 ? void 0 : _a.errors[0]) ? `<strong>${json.error.errors[0].reason}</strong>: ${json.error.errors[0].message.replace(/<\/?[^>]+(>|$)/g, '')}` : `HTTP ${response.status}: ${response.url}`);
        }
        return await response.json();
    }
    function apiUrl(action, param) {
        let url = "https://www.googleapis.com/youtube/v3/" + action + '?';
        url += new URLSearchParams(Object.assign(Object.assign({}, param), { key: apiKey })).toString();
        return url;
    }
    setApiKey();
    return (action, apiArgs) => makeRequest(apiUrl(action, apiArgs));
})();
function getChannelActivities(channelId, after = new Date()) {
    return apiRequest("activities", {
        part: "snippet,contentDetails",
        channelId: channelId,
        publishedAfter: after.toISOString(),
        maxResults: 50
    });
}
const VIDEO_DOES_NOT_EXIST = Symbol("Video does not exist");
function getDuration(videoId) {
    return apiRequest("videos", {
        part: "contentDetails",
        fields: "items/contentDetails/duration",
        id: videoId,
    }).then(json => {
        if (json.items.length === 0) {
            throw VIDEO_DOES_NOT_EXIST;
        }
        return {
            videoId,
            duration: niceDuration(json.items[0].contentDetails.duration)
        };
    });
}
function getTagsAndDuration(videoId) {
    return apiRequest("videos", {
        part: "snippet,contentDetails",
        fields: "items/contentDetails/duration,items/snippet/tags",
        id: videoId,
    }).then(res => {
        res = res.items[0];
        return {
            duration: niceDuration(res.contentDetails.duration),
            tags: (res.snippet && res.snippet.tags) || []
        };
    });
}
function getVideoInfo(videoIdList) {
    let joinedIds = videoIdList.join(",");
    return apiRequest("videos", {
        part: "snippet,contentDetails,statistics,id",
        fields: "items(id,contentDetails/duration,statistics/viewCount,snippet(title,channelTitle,channelId,publishedAt,thumbnails/medium))",
        id: joinedIds,
        maxResults: 50,
    }).then(response => {
        return response.items.map((item) => ({
            id: item.id,
            title: item.snippet.title,
            url: 'https://www.youtube.com/watch?v=' + item.id,
            duration: niceDuration(item.contentDetails.duration),
            views: {
                count: item.statistics.viewCount,
                asString: shortenLargeNumber(item.statistics.viewCount),
            },
            publishedAt: new Date(item.snippet.publishedAt).getTime(),
            thumbnail: item.snippet.thumbnails.medium.url,
            channelId: item.snippet.channelId,
            channelTitle: item.snippet.channelTitle,
        }));
    });
}
function searchChannel(query, max = 3) {
    return apiRequest("search", {
        part: "snippet",
        type: "channel",
        order: "relevance",
        q: query
    }).then(responseJson => {
        let payLoad = [];
        if (responseJson.pageInfo.totalResults > 0) {
            const howMany = Math.min(responseJson.pageInfo.totalResults, max);
            for (let i = 0; i < howMany; i++) {
                if (responseJson.items[i]) {
                    payLoad.push({
                        title: responseJson.items[i].snippet.title,
                        url: 'https://www.youtube.com/channel/' + responseJson.items[i].id.channelId + '/videos',
                        description: responseJson.items[i].snippet.description,
                        thumbnail: responseJson.items[i].snippet.thumbnails.medium.url,
                        id: responseJson.items[i].id.channelId
                    });
                }
            }
        }
        return payLoad;
    });
}
