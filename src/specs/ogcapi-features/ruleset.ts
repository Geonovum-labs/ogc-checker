import { RulesetDefinition } from '@stoplight/spectral-core';
import { oas } from '@stoplight/spectral-rulesets';

const ruleset: RulesetDefinition = {
  extends: oas as RulesetDefinition,
};

export default ruleset;
