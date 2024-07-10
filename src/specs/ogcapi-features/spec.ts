import { Spec } from '../../types';
import example from './example.json';

const spec: Spec = {
  name: 'OGC API Features',
  slug: 'ogcapi-features',
  example: JSON.stringify(example, undefined, 2),
};

export default spec;
