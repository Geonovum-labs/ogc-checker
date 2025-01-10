import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from '@stoplight/spectral-formats';
import { schema } from '@stoplight/spectral-functions';
import { errorMessage } from '../../../util';

export const OGC_API_FEATURES_CRS_URI = 'http://www.opengis.net/spec/ogcapi-features-2/1.0/conf/crs';

const featuresCrs: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/ogcapi-features-2/1.0/req/crs',
  description:
    'OGC API - Features - Part 2: Coordinate Reference Systems by Reference - Requirements Class "Coordinate Reference Systems by Reference"',
  formats: [oas3_0],
  rules: {
    '/req/crs/fc-md-crs-list': {
      given: [
        "$.paths['/collections'].get.responses.200.content[application/json].schema.properties.collections.items",
        '$.paths[?(@property.match(/^\\/collections\\/[^/]+$/))].get.responses.200.content[application/json].schema',
      ],
      message:
        'The crs property in the collection object of a spatial feature collection SHALL contain the identifiers for the list of CRSs ' +
        'supported by the server for that collection. {{error}}',
      severity: 'error',
      then: {
        function: input => {
          if (!(typeof input === 'object')) {
            return;
          }

          if (!('required' in input) || !Array.isArray(input.required) || !input.required.includes('crs')) {
            return errorMessage('The "crs" property must be set as required.');
          }
        },
      },
    },
    '/req/crs/fc-md-storageCrs-valid-value': {
      given: [
        "$.paths['/collections'].get.responses.200.content[application/json].schema.properties.collections.items",
        '$.paths[?(@property.match(/^\\/collections\\/[^/]+$/))].get.responses.200.content[application/json].schema',
      ],
      message:
        'The value of the storageCrs property SHALL be one of the CRS identifiers from the list of supported CRS identifiers found in the ' +
        'collection object using the crs property. {{error}}',
      severity: 'error',
      then: {
        function: schema,
        functionOptions: {
          schema: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            properties: {
              properties: {
                type: 'object',
                dependentRequired: {
                  storageCrsCoordinateEpoch: ['storageCrs'],
                },
                properties: {
                  storageCrs: {
                    required: ['type', 'format'],
                    properties: {
                      type: { const: 'string' },
                      format: { const: 'uri' },
                    },
                  },
                  storageCrsCoordinateEpoch: {
                    required: ['type'],
                    properties: {
                      type: { const: 'number' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/req/crs/fc-bbox-crs-definition': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get',
      message: "Each GET request on a 'features' resource SHALL support a query parameter bbox-crs. {{error}}",
      severity: 'error',
      then: {
        function: schema,
        functionOptions: {
          schema: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            required: ['parameters'],
            properties: {
              parameters: {
                type: 'array',
                maxContains: 1,
                contains: {
                  type: 'object',
                  required: ['name', 'in', 'schema'],
                  properties: {
                    name: { const: 'bbox-crs' },
                    in: { const: 'query' },
                    required: { const: false },
                    schema: {
                      type: 'object',
                      required: ['type', 'format'],
                      properties: {
                        type: { const: 'string' },
                        format: { const: 'uri' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default featuresCrs;
