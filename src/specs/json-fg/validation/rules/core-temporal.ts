import { DateTime, Settings } from 'luxon';
import { Rule } from '../ruleValidation';

Settings.defaultZone = 'utc';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const TIMESTAMP_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

const isUnbounded = (value: string) => value === '..';

const isDate = (value: string) => DATE_REGEX.test(value);

const isTimestamp = (value: string) => TIMESTAMP_REGEX.test(value);

const rules: Rule[] = [];

rules.push({
  name: '/req/core/interval',
  validateFeature: feature => {
    const interval = feature.time?.interval;

    if (
      interval !== undefined &&
      !isUnbounded(interval[0]) &&
      !isUnbounded(interval[1]) &&
      DateTime.fromISO(interval[0]) > DateTime.fromISO(interval[1])
    ) {
      return {
        pointer: '/time',
        message:
          'If the "time" object in any JSON-FG feature in the JSON document includes an "interval" member, the start ' +
          'instant must be earlier than or equal to the end instant.',
      };
    }

    if (interval !== undefined && isDate(interval[0]) && isTimestamp(interval[1])) {
      return {
        pointer: '/time',
        message: 'If the start is a date, the end SHALL be a date, too, or "..".',
      };
    }

    if (interval !== undefined && isTimestamp(interval[0]) && isDate(interval[1])) {
      return {
        pointer: '/time',
        message: 'If the start is a timestamp, the end SHALL be a timestamp, too, or "..".',
      };
    }
  },
});

rules.push({
  name: '/req/core/instant-and-interval',
  validateFeature: feature => {
    if (feature.time) {
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
          (isDate(interval[0]) || isDate(interval[1])) &&
          ((!isUnbounded(interval[0]) && tsDate < DateTime.fromISO(interval[0])) ||
            (!isUnbounded(interval[1]) && tsDate > DateTime.fromISO(interval[1])))
        ) {
          return {
            pointer: '/time',
            message:
              'If the "time" object in any JSON-FG feature in the JSON document includes both a "timestamp" and an ' +
              '"interval" member with start/end dates, the interval SHALL contain the date of the timestamp.',
          };
        }

        if (
          (isTimestamp(interval[0]) || isTimestamp(interval[1])) &&
          ((!isUnbounded(interval[0]) && ts < DateTime.fromISO(interval[0])) ||
            (!isUnbounded(interval[1]) && ts > DateTime.fromISO(interval[1])))
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
          (isDate(interval[0]) || isDate(interval[1])) &&
          ((!isUnbounded(interval[0]) && tsDate < DateTime.fromISO(interval[0])) ||
            (!isUnbounded(interval[1]) && tsDate > DateTime.fromISO(interval[1])))
        ) {
          return {
            pointer: '/time',
            message:
              'If the "time" object in any JSON-FG feature in the JSON document includes both a "date" and an ' +
              '"interval" member with start/end dates, the interval SHALL contain the date.',
          };
        }

        if (
          (isTimestamp(interval[0]) || isTimestamp(interval[1])) &&
          ((!isUnbounded(interval[0]) && tsDate < DateTime.fromISO(interval[0]).startOf('day')) ||
            (!isUnbounded(interval[1]) && tsDate > DateTime.fromISO(interval[1]).startOf('day')))
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
