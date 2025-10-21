import { RulesetDefinition } from '@stoplight/spectral-core';

export const JSON_FG_MEASURES_URI = 'http://www.opengis.net/spec/json-fg-1/0.3/conf/measures';

export const JSON_FG_MEASURES_DOC_URI = 'https://docs.ogc.org/DRAFTS/21-045.html#measures_';

const measures: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.3/req/measures',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Measures"',
  rules: {},
};

export default measures;
