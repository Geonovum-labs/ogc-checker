import { RulesetDefinition } from '@stoplight/spectral-core';
import { pattern } from '@stoplight/spectral-functions';

const ruleset: RulesetDefinition = {
  rules: {
    'no-empty-description': {
      given: '$..description',
      message: 'Description must not be empty',
      then: {
        function: pattern,
        functionOptions: {
          notMatch: '^\\s*$',
        },
      },
    },
  },
};

export default ruleset;
