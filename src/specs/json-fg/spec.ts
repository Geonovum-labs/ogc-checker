import { spectralLinter } from '../../spectral';
import { Spec } from '../../types';
import example from './example.json';
import rulesets, { JSON_FG_3D, JSON_FG_CORE, JSON_FG_TYPES_SCHEMAS } from './rulesets';

const linterName = (confClass: string) => confClass.replace('http://www.opengis.net/spec/', '');

const spec: Spec = {
  name: 'JSON-FG',
  slug: 'json-fg',
  example: JSON.stringify(example, undefined, 2),
  linters: [
    {
      name: linterName(JSON_FG_CORE),
      linter: spectralLinter(linterName(JSON_FG_CORE), rulesets[JSON_FG_CORE]),
    },
    {
      name: linterName(JSON_FG_3D),
      linter: spectralLinter(linterName(JSON_FG_3D), rulesets[JSON_FG_3D]),
    },
    {
      name: linterName(JSON_FG_TYPES_SCHEMAS),
      linter: spectralLinter(linterName(JSON_FG_TYPES_SCHEMAS), rulesets[JSON_FG_TYPES_SCHEMAS]),
    },
  ],
};

export default spec;
