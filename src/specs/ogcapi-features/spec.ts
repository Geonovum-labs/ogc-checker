import { spectralLinter } from '../../spectral';
import { Spec } from '../../types';
import example from './example.json';
import ruleset from './ruleset';

const spec: Spec = {
  name: 'OGC API - Features',
  slug: 'ogcapi-features',
  example: JSON.stringify(example, undefined, 2),
  linters: [spectralLinter(ruleset)],
  responseMapper: responseText =>
    Promise.resolve({
      content: responseText,
      additionaLinters: [],
    }),
};

export default spec;
