import type { RulesetDefinition } from '@stoplight/spectral-core';
import remoteSchema, { SchemaFunctionResult } from '../../functions/remoteSchema';
import { Rulesets } from '../../spectral';

export const JSON_FG_CORE = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/core';
export const JSON_FG_3D = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/3d';
export const JSON_FG_TYPES_SCHEMAS = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/types-schemas';

const jsonFgCore: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.2/req/core',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Core"',
  rules: {
    '/req/core/schema-valid': {
      given: '$',
      message:
        'The JSON document SHALL validate against the JSON Schema of a JSON-FG feature (a JSON-FG feature) or the JSON Schema of a JSON-FG feature collection (a JSON-FG feature collection). {{error}}.',
      severity: 'error',
      then: [
        {
          function: remoteSchema,
          functionOptions: {
            schema: (input: unknown): SchemaFunctionResult => {
              if (input && typeof input === 'object' && 'type' in input) {
                switch (input.type) {
                  case 'Feature':
                    return { schema: { $ref: 'https://beta.schemas.opengis.net/json-fg/feature.json' } };
                  case 'FeatureCollection':
                    return { schema: { $ref: 'https://beta.schemas.opengis.net/json-fg/featurecollection.json' } };
                  default:
                    return {
                      error: {
                        message: 'Property `type` must contain "Feature" or "FeatureCollection".',
                        path: ['type'],
                      },
                    };
                }
              } else if (typeof input === 'object') {
                return {
                  error: {
                    message: 'Object must have required property "type".',
                  },
                };
              } else {
                return {
                  error: {
                    message: 'Document is not an object.',
                  },
                };
              }
            },
          },
        },
      ],
    },
  },
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