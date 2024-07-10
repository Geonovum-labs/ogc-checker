import { Spec } from '../../types';
import example from './example.json';
import ruleValidation from './validation/ruleValidation';
import schemaValidation from './validation/schemaValidation';

const spec: Spec = {
  name: 'JSON-FG',
  slug: 'json-fg',
  example: JSON.stringify(example, undefined, 2),
  linters: [schemaValidation, ruleValidation],
};

export default spec;
