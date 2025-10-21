import { RulesetDefinition } from '@stoplight/spectral-core';

export const JSON_FG_API_URI = 'http://www.opengis.net/spec/json-fg-1/0.3/conf/api';

export const JSON_FG_API_DOC_URI = 'https://docs.ogc.org/DRAFTS/21-045.html#api_';

const api: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.3/req/api',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "JSON-FG in Web APIs"',
  rules: {},
};

export default api;
