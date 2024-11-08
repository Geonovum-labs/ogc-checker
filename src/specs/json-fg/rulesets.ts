import type { RulesetDefinition } from '@stoplight/spectral-core';
import { Rulesets } from '../../spectral';

export const JSON_FG_CORE = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/core';
export const JSON_FG_3D = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/3d';
export const JSON_FG_TYPES_SCHEMAS = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/types-schemas';

const jsonFgCore: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.2/req/core',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Core"',
  rules: {},
};

const jsonFg3D: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.2/req/3d',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "3D"',
  rules: {},
};

const jsonFgTypesSchemas: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.2/req/types-schemas',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Feature Types and Schemas"',
  rules: {},
};

const rulesets: Rulesets = {
  [JSON_FG_CORE]: jsonFgCore,
  [JSON_FG_3D]: jsonFg3D,
  [JSON_FG_TYPES_SCHEMAS]: jsonFgTypesSchemas,
};

export default rulesets;
