import { spectralLinter } from '../../spectral';
import { Spec } from '../../types';
import example from './example.json';
import rulesets from './rulesets';

const linterName = (confClass: string) => confClass.replace('http://www.opengis.net/spec/', '');

const spec: Spec = {
  name: 'JSON-FG',
  slug: 'json-fg',
  example: JSON.stringify(example, undefined, 2),
  linters: Object.entries(rulesets).map(entry => ({
    name: linterName(entry[0]),
    linter: spectralLinter(linterName(entry[0]), entry[1]),
  })),
};

export default spec;
