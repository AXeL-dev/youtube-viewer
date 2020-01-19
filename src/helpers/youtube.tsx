/*
This Source Code Form is subject to the terms of the
Mozilla Public License, v. 2.0.
If a copy of the MPL was not distributed with this file,
You can obtain one at http://mozilla.org/MPL/2.0/.
Author: XrXr

This module provide functions for making api certain YouTube Data API V3
requests. All functions return promise.
*/

import { nice_duration, shortenLargeNumber, TimeAgo } from './utils';

const api_key = "AIzaSyB6mi40O6WOd17yjeYkK-y5lIU4FvoR8fo";

const log_error = (e: any) => console.error(e);

const api_request = (() => {
    async function make_request (url: string) {
        let response = await window.fetch(url);
        //console.log(`HTTP ${response.status}: ${response.url}`);
        if (!response.ok) {
            throw Error(`HTTP ${response.status}: ${response.url}`);
        }
        return await response.json();
    }

    function api_url (action: string, param: any) {
        let url = "https://www.googleapis.com/youtube/v3/" + action + '?';
        url += new URLSearchParams({...param, key: api_key }).toString();
        return url;
    }

    return (action: string, api_args: any) => make_request(api_url(action, api_args));
})();

// Request a channel's activities after a date
// Return a promise that resolves to api response
function get_activities (channel_id: string, after: Date = new Date()) {
    return api_request("activities", {
        part: "snippet,contentDetails",
        channelId: channel_id,
        publishedAfter: after.toISOString(),
        maxResults: 50
    });
}

const VIDEO_DOES_NOT_EXIST = Symbol("Video does not exist");
function get_duration (video_id: string) {
    return api_request("videos", {
        part: "contentDetails",
        fields: "items/contentDetails/duration",
        id: video_id,
    }).then(json => {
        if (json.items.length === 0) {
            throw VIDEO_DOES_NOT_EXIST;
        }
        return {
            video_id,
            duration: nice_duration(json.items[0].contentDetails.duration)
        };
    });
}

function get_tags_and_duration (video_id: string) {
    return api_request("videos", {
        part: "snippet,contentDetails",
        fields: "items/contentDetails/duration,items/snippet/tags",
        id: video_id,
    }).then(res => {
        res = res.items[0];
        return {
            duration: nice_duration(res.contentDetails.duration),
            tags: (res.snippet && res.snippet.tags) || []
        };
    });
}

function get_video_info (video_id_list: string[]) {
    let joined_id = video_id_list.join(",");
    return api_request("videos", {
        part: "snippet,contentDetails,statistics,id",
        fields: "items(id,contentDetails/duration,statistics/viewCount,snippet(title,channelTitle,channelId,publishedAt,thumbnails/medium))",
        id: joined_id,
        maxResults: 50,
    }).then(response => {
        //console.log(response);
        return response.items.map((video_item: any) => ({
            id: video_item.id,
            title: video_item.snippet.title,
            url: 'https://youtu.be/' + video_item.id,
            duration: nice_duration(video_item.contentDetails.duration),
            views: shortenLargeNumber(video_item.statistics.viewCount),
            publishedAt: TimeAgo.inWords(new Date(video_item.snippet.publishedAt).getTime()),
            thumbnails: video_item.snippet.thumbnails,
            channelId: video_item.snippet.channelId,
            channelTitle: video_item.snippet.channelTitle,
        }));
    });
}

get_video_info.batch_size = 50;

// Request to search channel matching `query`. Return a promise that will
// resolve to either [] or [channels]
function search_channel (query: string, max: number = 3) {
    return api_request("search", {
        part: "snippet",
        type: "channel",
        order: "relevance",
        q: query
    }).then(response_json => {
        let pay_load: any = [];
        if (response_json.pageInfo.totalResults > 0) {
            let how_many = Math.min(response_json.pageInfo.totalResults, max);
            for (let i = 0; i < how_many; i++) {
                if (response_json.items[i]) {
                    pay_load.push({
                        title: response_json.items[i].snippet.title,
                        thumbnail: response_json.items[i].snippet.thumbnails.medium.url,
                        id: response_json.items[i].id.channelId
                    });
                }
            }
        }
        return pay_load;
    }, log_error).then(null, log_error);
}

export {
    search_channel,
    get_duration,
    get_activities,
    get_tags_and_duration,
    get_video_info,
    VIDEO_DOES_NOT_EXIST,
};
