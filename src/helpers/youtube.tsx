/*
This Source Code Form is subject to the terms of the
Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file,
You can obtain one at http://mozilla.org/MPL/2.0/.
Author: XrXr

This module provide functions for making api certain YouTube Data API V3
requests. All functions return promise.
*/

import { niceDuration, shortenLargeNumber, TimeAgo } from './utils';

const apiKey = "AIzaSyB6mi40O6WOd17yjeYkK-y5lIU4FvoR8fo";

const logError = (e: any) => console.error(e);

/**
 * Send API requests to youtube
 */
const apiRequest = (() => {
    async function makeRequest (url: string) {
        let response = await window.fetch(url);
        //console.log(`HTTP ${response.status}: ${response.url}`);
        if (!response.ok) {
            throw Error(`HTTP ${response.status}: ${response.url}`);
        }
        return await response.json();
    }

    function apiUrl (action: string, param: any) {
        let url = "https://www.googleapis.com/youtube/v3/" + action + '?';
        url += new URLSearchParams({...param, key: apiKey }).toString();
        return url;
    }

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
 * @param maxResults
 */
function getVideoInfo (videoIdList: string[], maxResults: number = 50) {
    let joinedIds = videoIdList.join(",");
    return apiRequest("videos", {
        part: "snippet,contentDetails,statistics,id",
        fields: "items(id,contentDetails/duration,statistics/viewCount,snippet(title,channelTitle,channelId,publishedAt,thumbnails/medium))",
        id: joinedIds,
        maxResults: maxResults,
    }).then(response => {
        //console.log(response);
        return response.items.map((videoItem: any) => ({
            id: videoItem.id,
            title: videoItem.snippet.title,
            url: 'https://youtu.be/' + videoItem.id,
            duration: niceDuration(videoItem.contentDetails.duration),
            views: shortenLargeNumber(videoItem.statistics.viewCount),
            publishedAt: TimeAgo.inWords(new Date(videoItem.snippet.publishedAt).getTime()),
            thumbnails: videoItem.snippet.thumbnails,
            channelId: videoItem.snippet.channelId,
            channelTitle: videoItem.snippet.channelTitle,
        }));
    });
}

getVideoInfo.batch_size = 50;

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
        let payLoad: any = [];
        //console.log(responseJson);
        if (responseJson.pageInfo.totalResults > 0) {
            let howMany = Math.min(responseJson.pageInfo.totalResults, max);
            for (let i = 0; i < howMany; i++) {
                if (responseJson.items[i]) {
                    payLoad.push({
                        title: responseJson.items[i].snippet.title,
                        description: responseJson.items[i].snippet.description,
                        thumbnail: responseJson.items[i].snippet.thumbnails.medium.url,
                        id: responseJson.items[i].id.channelId
                    });
                }
            }
        }
        return payLoad;
    }, logError).then(null, logError);
}

export {
    searchChannel,
    getDuration,
    getChannelActivities,
    getTagsAndDuration,
    getVideoInfo,
    VIDEO_DOES_NOT_EXIST,
};
