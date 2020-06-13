/*
This Source Code Form is subject to the terms of the
Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file,
You can obtain one at http://mozilla.org/MPL/2.0/.
Author(s): XrXr, AXeL-dev

This module provide functions for making api certain YouTube Data API V3
requests. All functions return promise.
*/

import { niceDuration, shortenLargeNumber } from './utils';
import { getFromStorage } from './storage';

let apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;

/**
 * Send API requests to youtube
 */
const apiRequest = (() => {
    async function setApiKey() {
        const [settings] = await getFromStorage('settings');
        apiKey = settings?.apiKey?.length ? settings.apiKey : apiKey;
    }

    async function makeRequest (url: string) {
        let response = await window.fetch(url);
        //console.log(`HTTP ${response.status}: ${response.url}`);
        if (!response.ok) {
            const json = await response.json();
            //console.log(json);
            throw Error(json?.error?.errors[0] ? `<strong>${json.error.errors[0].reason}</strong>: ${json.error.errors[0].message.replace(/<\/?[^>]+(>|$)/g, '')}` : `HTTP ${response.status}: ${response.url}`);
        }
        return await response.json();
    }

    function apiUrl (action: string, param: any) {
        let url = "https://www.googleapis.com/youtube/v3/" + action + '?';
        url += new URLSearchParams({...param, key: apiKey }).toString();
        return url;
    }

    setApiKey();

    return (action: string, apiArgs: any) => makeRequest(apiUrl(action, apiArgs));
})();

/**
 * Request a channel's activities after a date
 * Return a promise that resolves to api response
 * 
 * @param channelId 
 * @param after 
 */
function getChannelActivities (channelId: string, after: Date = new Date()) {
    return apiRequest("activities", {
        part: "snippet,contentDetails",
        channelId: channelId,
        publishedAfter: after.toISOString(),
        maxResults: 50
    });
}

/**
 * Return video duration
 * 
 * @param videoId 
 */
const VIDEO_DOES_NOT_EXIST = Symbol("Video does not exist");
function getDuration (videoId: string) {
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

/**
 * Return video tags & duration
 * 
 * @param videoId 
 */
function getTagsAndDuration (videoId: string) {
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

/**
 * Return video informations
 * 
 * @param videoIdList 
 */
function getVideoInfo (videoIdList: string[]) {
    let joinedIds = videoIdList.join(",");
    return apiRequest("videos", {
        part: "snippet,contentDetails,statistics,id",
        fields: "items(id,contentDetails/duration,statistics/viewCount,snippet(title,channelTitle,channelId,publishedAt,thumbnails/medium))",
        id: joinedIds,
        maxResults: 50, // not working when id is filled (which is the case here)
    }).then(response => {
        //console.log(response);
        return response.items.map((item: any) => ({
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

//getVideoInfo.batch_size = 50;

/**
 * Request to search channel matching `query`. Return a promise that will
 * resolve to either [] or [channels]
 * 
 * @param query 
 * @param max 
 */
function searchChannel (query: string, max: number = 3) {
    return apiRequest("search", {
        part: "snippet",
        type: "channel",
        order: "relevance",
        q: query
    }).then(responseJson => {
        //console.log(responseJson);
        let payLoad: any = [];
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

export {
    searchChannel,
    getDuration,
    getChannelActivities,
    getTagsAndDuration,
    getVideoInfo,
    VIDEO_DOES_NOT_EXIST,
};
