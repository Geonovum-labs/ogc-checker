import { Rule } from './ruleValidation';

const rules: Rule[] = [];

rules.push({
  name: '/req/core/instant-and-interval',
  validateFeature: feature => {
    if (feature.time !== null) {
      const { date, timestamp } = feature.time;

      if (date !== undefined && timestamp !== undefined && !timestamp.startsWith(date)) {
        return {
          pointer: '/time',
          message:
            'If the "time" object in any JSON-FG feature in the JSON document includes both a "date" and a "timestamp" member, the full-date parts SHALL be identical.',
        };
      }
    }
  },
});

export default rules;
