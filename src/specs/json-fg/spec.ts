import { Spec } from '../../types';
import example from './example.json';

const spec: Spec = {
  name: 'JSON-FG',
  slug: 'json-fg',
  example: JSON.stringify(example, undefined, 2),
};

export default spec;
