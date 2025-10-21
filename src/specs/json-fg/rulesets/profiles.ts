import { RulesetDefinition } from '@stoplight/spectral-core';

export const JSON_FG_PROFILES_URI = 'http://www.opengis.net/spec/json-fg-1/0.3/conf/profiles';

export const JSON_FG_PROFILES_DOC_URI = 'https://docs.ogc.org/DRAFTS/21-045.html#profiles_';

const profiles: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.3/req/profiles',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "GeoJSON Profiles"',
  rules: {},
};

export default profiles;
