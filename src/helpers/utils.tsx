
export function nice_duration (ISO_8601_string: string) {
  let time = ISO_8601_string.replace("PT", "").toUpperCase();
  let h = extract('H');
  let m = extract('M');
  let s = extract('S');
  return h !== '00' ? [h, m, s].join(':') : [m, s].join(':');

  function extract (stop: string) {
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
export function shortenLargeNumber(num: number, digits: number = 1) {
  let units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
      decimal;

  for(let i=units.length-1; i>=0; i--) {
      decimal = Math.pow(1000, i+1);

      if(num <= -decimal || num >= decimal) {
          return +(num / decimal).toFixed(digits) + units[i];
      }
  }

  return num;
}

// Stolen from: https://stackoverflow.com/a/37802747
export const TimeAgo = (() => {
  let self: any = {};

  // Public Methods
  self.locales = {
    prefix: '',
    sufix:  'ago',
    
    seconds: 'less than a minute',
    minute:  'about a minute',
    minutes: '%d minutes',
    hour:    'about an hour',
    hours:   'about %d hours',
    day:     'a day',
    days:    '%d days',
    month:   'about a month',
    months:  '%d months',
    year:    'about a year',
    years:   '%d years'
  };
  
  self.inWords = (timeAgo: any) => {
    let seconds = Math.floor((new Date() as any - parseInt(timeAgo)) / 1000),
        separator = self.locales.separator || ' ',
        words = self.locales.prefix + separator,
        interval = 0,
        intervals: any = {
          year:   seconds / 31536000,
          month:  seconds / 2592000,
          day:    seconds / 86400,
          hour:   seconds / 3600,
          minute: seconds / 60
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

// Return current date - number of days before
export function getDateBefore(before: number = 0): Date {
  let date = new Date();
  date.setDate(date.getDate() - before);
  return date;
}
