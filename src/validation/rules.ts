import { DateTime, Settings } from 'luxon';
import { Rule } from './ruleValidation';

Settings.defaultZone = 'utc';

const rules: Rule[] = [];

rules.push({
  name: '/req/core/instant-and-interval',
  validateFeature: feature => {
    if (feature.time !== null) {
      const { date, timestamp, interval } = feature.time;

      if (date !== undefined && timestamp !== undefined && !timestamp.startsWith(date)) {
        return {
          pointer: '/time',
          message:
            'If the "time" object in any JSON-FG feature in the JSON document includes both a "date" and a "timestamp" ' +
            'member, the full-date parts SHALL be identical.',
        };
      }

      if (timestamp !== undefined && interval !== undefined) {
        const ts = DateTime.fromISO(timestamp);
        const tsDate = ts.startOf('day');

        if (
          (interval[0].length === 10 || interval[1].length === 10) &&
          ((interval[0] !== '..' && tsDate < DateTime.fromISO(interval[0])) ||
            (interval[1] !== '..' && tsDate > DateTime.fromISO(interval[1])))
        ) {
          return {
            pointer: '/time',
            message:
              'If the "time" object in any JSON-FG feature in the JSON document includes both a "timestamp" and an ' +
              '"interval" member with start/end dates, the interval SHALL contain the date of the timestamp.',
          };
        }

        if (
          (interval[0].length > 10 || interval[1].length > 10) &&
          ((interval[0] !== '..' && ts < DateTime.fromISO(interval[0])) ||
            (interval[1] !== '..' && ts > DateTime.fromISO(interval[1])))
        ) {
          return {
            pointer: '/time',
            message:
              'If the "time" object in any JSON-FG feature in the JSON document includes both a "timestamp" and an ' +
              '"interval" member with start/end timestamps, the interval SHALL contain the timestamp.',
          };
        }
      }

      if (date !== undefined && interval !== undefined) {
        const tsDate = DateTime.fromISO(date);

        if (
          (interval[0].length === 10 || interval[1].length === 10) &&
          ((interval[0] !== '..' && tsDate < DateTime.fromISO(interval[0])) ||
            (interval[1] !== '..' && tsDate > DateTime.fromISO(interval[1])))
        ) {
          return {
            pointer: '/time',
            message:
              'If the "time" object in any JSON-FG feature in the JSON document includes both a "date" and an ' +
              '"interval" member with start/end dates, the interval SHALL contain the date.',
          };
        }

        if (
          (interval[0].length > 10 || interval[1].length > 10) &&
          ((interval[0] !== '..' && tsDate < DateTime.fromISO(interval[0]).startOf('day')) ||
            (interval[1] !== '..' && tsDate > DateTime.fromISO(interval[1]).startOf('day')))
        ) {
          return {
            pointer: '/time',
            message:
              'If the "time" object in any JSON-FG feature in the JSON document includes both a "date" and an ' +
              '"interval" member with start/end timestamps, the interval SHALL include timestamps on the date.',
          };
        }
      }
    }
  },
});

export default rules;
