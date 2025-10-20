import { RulesetDefinition } from '@stoplight/spectral-core';

export const JSON_FG_POLYHEDRA_URI = 'http://www.opengis.net/spec/json-fg-1/0.3/conf/polyhedra';

export const JSON_FG_POLYHEDRA_DOC_URI = 'https://docs.ogc.org/DRAFTS/21-045.html#polyhedra_';

const jsonFgPolyhedra: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.3/req/polyhedra',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Polyhedra"',
  rules: {},
};

export default jsonFgPolyhedra;
