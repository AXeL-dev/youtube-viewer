/**
 * Convert youtube duration to readable format
 *
 * @param ISO_8601_string {string}
 */
export function niceDuration(ISO_8601_string: string) {
  let time = ISO_8601_string.replace('PT', '').toUpperCase();
  let h = extract('H');
  let m = extract('M');
  let s = extract('S');
  return h !== '00' ? [h, m, s].join(':') : [m, s].join(':');

  function extract(stop: string) {
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

// -------------------------------------------------------------------

/**
 * Shorten number to thousands, millions, billions, etc.
 * http://en.wikipedia.org/wiki/Metric_prefix
 *
 * @param {number} num Number to shorten.
 * @param {number} [digits=0] The number of digits to appear after the decimal point.
 * @returns {string|number}
 *
 * @example
 * // returns '12.5k'
 * shortenLargeNumber(12543, 1)
 *
 * @example
 * // returns '-13k'
 * shortenLargeNumber(-12567)
 *
 * @example
 * // returns '51M'
 * shortenLargeNumber(51000000)
 *
 * @example
 * // returns 651
 * shortenLargeNumber(651)
 *
 * @example
 * // returns 0.12345
 * shortenLargeNumber(0.12345)
 */
export function shortenLargeNumber(num: number, digits: number = 0) {
  let units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
    decimal;

  for (let i = units.length - 1; i >= 0; i--) {
    decimal = Math.pow(1000, i + 1);

    if (num <= -decimal || num >= decimal) {
      return +(num / decimal).toFixed(digits) + units[i];
    }
  }

  return num;
}

// -------------------------------------------------------------------

/**
 * Return Date & time in words
 * Stolen from: https://stackoverflow.com/a/37802747
 */
export const TimeAgo = (() => {
  let self: any = {};

  // Public Methods
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
    years: '%d years',
  };

  self.inWords = (timeAgo: any) => {
    let seconds = Math.floor(((new Date() as any) - parseInt(timeAgo)) / 1000),
      separator = self.locales.separator || ' ',
      words = self.locales.prefix + separator,
      interval = 0,
      intervals: any = {
        year: seconds / 31536000,
        month: seconds / 2592000,
        day: seconds / 86400,
        hour: seconds / 3600,
        minute: seconds / 60,
      };

    let distance = self.locales.seconds;

    for (let key in intervals) {
      interval = Math.floor(intervals[key]);

      if (interval > 1) {
        distance = self.locales[key + 's'];
        break;
      } else if (interval === 1) {
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

// -------------------------------------------------------------------

/**
 * Return current date minus number of days before
 *
 * @param before {number}
 */
export function getDateBefore(before: number = 0): Date {
  let date = new Date();
  date.setDate(date.getDate() - before);
  date.setHours(0, 0, 0, 0);
  return date;
}

// -------------------------------------------------------------------

/**
 * Check if the given timestamp is in today's date
 * Stolen from: https://stackoverflow.com/a/40628566
 *
 * @param timestamp
 */
export function isInToday(timestamp: number) {
  let today = new Date();
  if (today.setHours(0, 0, 0, 0) === new Date(timestamp).setHours(0, 0, 0, 0)) {
    return true;
  } else {
    return false;
  }
}

// -------------------------------------------------------------------

/**
 * Returns hours difference between two dates
 * Stolen from: https://www.w3resource.com/javascript-exercises/javascript-date-exercise-45.php
 *
 * @param dt1
 * @param dt2
 */
export function diffHours(dt1: Date, dt2: Date): number {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
}

// -------------------------------------------------------------------

/**
 * Returns elapsed hours since the provided date
 *
 * @param dt
 */
export function elapsedHours(dt: Date): number {
  const now = new Date();
  return diffHours(now, dt);
}

// -------------------------------------------------------------------

/**
 * Return a new RegExp object instance
 *
 * @param pattern
 * @param modifiers
 */
export function regex(pattern: string, modifiers: string): RegExp {
  return new RegExp(pattern, modifiers);
}

// -------------------------------------------------------------------

/**
 * Return size of an object
 * Stolen from: https://gist.github.com/zensh/4975495
 *
 * @param obj
 */
export function memorySizeOf(obj: any) {
  let bytes = 0;

  function sizeOf(obj: any) {
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
          let objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if (objClass === 'Object' || objClass === 'Array') {
            for (let key in obj) {
              if (!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else bytes += obj.toString().length * 2;
          break;
      }
    }
    return bytes;
  }

  function formatByteSize(bytes: number) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + ' KiB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + ' MiB';
    else return (bytes / 1073741824).toFixed(3) + ' GiB';
  }

  return formatByteSize(sizeOf(obj));
}

// -------------------------------------------------------------------

/**
 * Create a new function that limits calls to func to once every given timeframe.
 * Stolen from: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_throttle
 *
 * @param callback
 * @param timeFrame
 */
export function throttle(callback: Function, timeFrame: number) {
  let lastTime = 0;
  return (...args: any) => {
    let now = new Date().getTime();
    if (now - lastTime >= timeFrame) {
      callback(...args);
      lastTime = now;
    }
  };
}

// -------------------------------------------------------------------

/**
 * Create a new function that calls func with thisArg and args.
 * Stolen from: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_debounce
 *
 * @param callback
 * @param wait
 * @param immediate
 */
export function debounce(
  callback: Function,
  wait: number,
  immediate?: boolean
) {
  let timeout: any = null;
  return function (this: any, ...args: any) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) callback.apply(context, args);
    }, wait);
    if (immediate && !timeout) callback.apply(context, args);
  };
}

// -------------------------------------------------------------------

/**
 * Generates 26 [a-z0-9] characters, yielding a UID that is both shorter and more unique than RFC compliant GUIDs.
 * Dashes can be trivially added if human-readability matters.
 * Stolen from: https://stackoverflow.com/a/13403498
 */
export function generateGuid() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// -------------------------------------------------------------------

/**
 * A little function to help us with reordering lists
 *
 * @param list
 * @param currentIndex
 * @param newIndex
 */
export function reorder<T>(
  list: T[],
  currentIndex: number,
  newIndex: number
): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(currentIndex, 1);
  result.splice(newIndex, 0, removed);

  return result;
}

// -------------------------------------------------------------------

/**
 * Prevent default event operations
 *
 * @param event
 */
export function noop<T>(event: React.MouseEvent<T>) {
  event.stopPropagation();
  event.preventDefault();
}
