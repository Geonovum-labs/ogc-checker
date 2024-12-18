import type { RulesetDefinition } from '@stoplight/spectral-core';
import { falsy, truthy } from '@stoplight/spectral-functions';
import { includes } from '../../../functions/includes';
import remoteSchema, { SchemaFunctionResult } from '../../../functions/remoteSchema';

export const CC_CORE_URI = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/core';
export const CC_CORE_CURIE = '[ogc-json-fg-1-0.2:core]';

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
    '/req/core/metadata#A': {
      given: '$',
      message: 'The JSON document SHALL include a "conformsTo" member.',
      severity: 'error',
      then: {
        field: 'conformsTo',
        function: truthy,
      },
    },
    '/req/core/metadata#B': {
      given: '$',
      message: `The "conformsTo" member of the JSON document SHALL include at least one of the two following values: "${CC_CORE_URI}", "${CC_CORE_CURIE}".`,
      severity: 'error',
      then: {
        field: 'conformsTo',
        function: includes,
        functionOptions: {
          anyOf: [CC_CORE_URI, CC_CORE_CURIE],
        },
      },
    },
    '/req/core/metadata#C': {
      given: '$.features',
      message: 'Only the root object of the JSON document SHALL include a "conformsTo" member.',
      severity: 'error',
      then: {
        field: 'conformsTo',
        function: falsy,
      },
    },
  },
};

export default jsonFgCore;
