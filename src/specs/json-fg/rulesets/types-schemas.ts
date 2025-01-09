import { RulesetDefinition } from '@stoplight/spectral-core';

const jsonFgTypesSchemas: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.2/req/types-schemas',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Feature Types and Schemas"',
  rules: {},
};

export const CC_TYPES_SCHEMAS_URI = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/types-schemas';
export const CC_TYPES_SCHEMAS_CURIE = '[ogc-json-fg-1-0.2:types-schemas]';

export default jsonFgTypesSchemas;
