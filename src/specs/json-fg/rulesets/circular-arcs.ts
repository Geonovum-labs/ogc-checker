import { RulesetDefinition } from '@stoplight/spectral-core';

export const JSON_FG_CIRCULAR_ARCS_URI = 'http://www.opengis.net/spec/json-fg-1/0.3/conf/circular-arcs';

export const JSON_FG_CIRCULAR_ARCS_DOC_URI = 'https://docs.ogc.org/DRAFTS/21-045.html#circular-arcs_';

const circularArcs: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.3/req/circular-arcs',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Circular Arcs"',
  rules: {},
};

export default circularArcs;
