function niceDuration(ISO_8601_string) {
    let time = ISO_8601_string.replace("PT", "").toUpperCase();
    let h = extract('H');
    let m = extract('M');
    let s = extract('S');
    return h !== '00' ? [h, m, s].join(':') : [m, s].join(':');
    function extract(stop) {
        for (let i = 0; i < time.length; i++) {
            if (time[i] === stop) {
                let val = time.slice(0, i);
                if (val.length === 1 && stop !== 'H') {
                    val = '0' + val;
                }
                time = time.slice(i + 1);
                return val;
            }
        }
        return '00';
    }
}
function shortenLargeNumber(num, digits = 0) {
    let units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'], decimal;
    for (let i = units.length - 1; i >= 0; i--) {
        decimal = Math.pow(1000, i + 1);
        if (num <= -decimal || num >= decimal) {
            return +(num / decimal).toFixed(digits) + units[i];
        }
    }
    return num;
}
const TimeAgo = (() => {
    let self = {};
    self.locales = {
        prefix: '',
        sufix: 'ago',
        seconds: 'less than a minute',
        minute: 'about a minute',
        minutes: '%d minutes',
        hour: 'about an hour',
        hours: 'about %d hours',
        day: 'a day',
        days: '%d days',
        month: 'about a month',
        months: '%d months',
        year: 'about a year',
        years: '%d years'
    };
    self.inWords = (timeAgo) => {
        let seconds = Math.floor((new Date() - parseInt(timeAgo)) / 1000), separator = self.locales.separator || ' ', words = self.locales.prefix + separator, interval = 0, intervals = {
            year: seconds / 31536000,
            month: seconds / 2592000,
            day: seconds / 86400,
            hour: seconds / 3600,
            minute: seconds / 60
        };
        let distance = self.locales.seconds;
        for (let key in intervals) {
            interval = Math.floor(intervals[key]);
            if (interval > 1) {
                distance = self.locales[key + 's'];
                break;
            }
            else if (interval === 1) {
                distance = self.locales[key];
                break;
            }
        }
        distance = distance.replace(/%d/i, interval);
        words += distance + separator + self.locales.sufix;
        return words.trim();
    };
    return self;
})();
function getDateBefore(before = 0) {
    let date = new Date();
    date.setDate(date.getDate() - before);
    return date;
}
function isInToday(timestamp) {
    let today = new Date();
    if (today.setHours(0, 0, 0, 0) === new Date(timestamp).setHours(0, 0, 0, 0)) {
        return true;
    }
    else {
        return false;
    }
}
function diffHours(dt1, dt2) {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= (60 * 60);
    return Math.abs(Math.round(diff));
}
function getRegex(pattern, modifiers) {
    return new RegExp(pattern, modifiers);
}
function memorySizeOf(obj) {
    var bytes = 0;
    function sizeOf(obj) {
        if (obj !== null && obj !== undefined) {
            switch (typeof obj) {
                case 'number':
                    bytes += 8;
                    break;
                case 'string':
                    bytes += obj.length * 2;
                    break;
                case 'boolean':
                    bytes += 4;
                    break;
                case 'object':
                    var objClass = Object.prototype.toString.call(obj).slice(8, -1);
                    if (objClass === 'Object' || objClass === 'Array') {
                        for (var key in obj) {
                            if (!obj.hasOwnProperty(key))
                                continue;
                            sizeOf(obj[key]);
                        }
                    }
                    else
                        bytes += obj.toString().length * 2;
                    break;
            }
        }
        return bytes;
    }
    function formatByteSize(bytes) {
        if (bytes < 1024)
            return bytes + " bytes";
        else if (bytes < 1048576)
            return (bytes / 1024).toFixed(3) + " KiB";
        else if (bytes < 1073741824)
            return (bytes / 1048576).toFixed(3) + " MiB";
        else
            return (bytes / 1073741824).toFixed(3) + " GiB";
    }
    return formatByteSize(sizeOf(obj));
}
