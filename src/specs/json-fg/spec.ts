import { spectralLinter } from '../../spectral';
import { Spec } from '../../types';
import example from './example.json';
import { jsonFg3D, jsonFgCore, jsonFgTypesSchemas } from './rulesets';

const JSON_FG_CORE = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/core';
const JSON_FG_3D = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/3d';
const JSON_FG_TYPES_SCHEMAS = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/types-schemas';

const linterName = (confClass: string) => confClass.replace('http://www.opengis.net/spec/', '');

const spec: Spec = {
  name: 'JSON-FG',
  slug: 'json-fg',
  example: JSON.stringify(example, undefined, 2),
  linters: [
    {
      name: linterName(JSON_FG_CORE),
      linter: spectralLinter(linterName(JSON_FG_CORE), jsonFgCore),
    },
    {
      name: linterName(JSON_FG_3D),
      linter: spectralLinter(linterName(JSON_FG_3D), jsonFg3D),
    },
    {
      name: linterName(JSON_FG_TYPES_SCHEMAS),
      linter: spectralLinter(linterName(JSON_FG_TYPES_SCHEMAS), jsonFgTypesSchemas),
    },
  ],
};

export default spec;
