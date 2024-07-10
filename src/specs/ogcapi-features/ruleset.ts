import { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from '@stoplight/spectral-formats';
import { oas } from '@stoplight/spectral-rulesets';

const ruleset: RulesetDefinition = {
  formats: [oas3_0],
  rules: {
    'oas3-schema': oas.rules['oas3-schema'],
  },
};

export default ruleset;
