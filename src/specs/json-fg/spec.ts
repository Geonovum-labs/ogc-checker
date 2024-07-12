import { Spec } from '../../types';
import example from './example.json';
import ruleValidation from './validation/ruleValidation';

export const JSON_FG_CORE_SCHEMA = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/core/schema';
export const JSON_FG_CORE = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/core';

const spec: Spec = {
  name: 'JSON-FG',
  slug: 'json-fg',
  example: JSON.stringify(example, undefined, 2),
  linters: [
    { name: JSON_FG_CORE_SCHEMA, linter: ruleValidation },
    { name: JSON_FG_CORE, linter: ruleValidation },
  ],
};

export default spec;
