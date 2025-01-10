import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';
import hasParameter from '../../../functions/hasParameter';
import { OpenAPIV3_0 } from '../../../openapi-types';
import { errorMessage } from '../../../util';

export const OGC_API_FEATURES_CORE_URI = 'http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core';

const featuresCore: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/ogcapi-features-1/1.0/req/core',
  description: 'OGC API - Features - Part 1: Core - Requirements Class "Core"',
  formats: [oas3_0],
  rules: {
    '/req/core/root-op': {
      given: '$.paths',
      message: 'The server SHALL support the HTTP GET operation at the path `/`.',
      severity: 'error',
      then: {
        field: '/.get',
        function: truthy,
      },
    },
    '/req/core/root-success': {
      given: "$.paths['/'].get.responses",
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      severity: 'error',
      then: {
        field: '200',
        function: truthy,
      },
    },
    '/req/core/conformance-op': {
      given: '$.paths',
      message: 'The server SHALL support the HTTP GET operation at the path `/conformance`.',
      severity: 'error',
      then: {
        field: '/conformance.get',
        function: truthy,
      },
    },
    '/req/core/conformance-success': {
      given: "$.paths['/conformance'].get.responses",
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      severity: 'error',
      then: {
        field: '200',
        function: truthy,
      },
    },
    '/req/core/fc-md-op': {
      given: '$.paths',
      message: 'The server SHALL support the HTTP GET operation at the path `/collections`.',
      severity: 'error',
      then: {
        field: '/collections.get',
        function: truthy,
      },
    },
    '/req/core/fc-md-success': {
      given: "$.paths['/collections'].get.responses",
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      severity: 'error',
      then: {
        field: '200',
        function: truthy,
      },
    },
    '/req/core/sfc-md-op': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+$/))]',
      message: 'The server SHALL support the HTTP GET operation at the path `/collections/{collectionId}`.',
      severity: 'error',
      then: {
        field: 'get',
        function: truthy,
      },
    },
    '/req/core/sfc-md-success': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+$/))].get.responses',
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      severity: 'error',
      then: {
        field: '200',
        function: truthy,
      },
    },
    '/req/core/fc-op': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))]',
      message:
        'For every feature collection identified in the feature collections response (path `/collections`), the server SHALL support the HTTP GET operation at the path `/collections/{collectionId}/items`.',
      severity: 'error',
      then: {
        field: 'get',
        function: truthy,
      },
    },
    '/req/core/fc-response': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get.responses',
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      severity: 'error',
      then: {
        field: '200',
        function: truthy,
      },
    },
    '/req/core/fc-limit-definition': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get',
      message: 'The operation SHALL support a parameter `limit`. {{error}}',
      severity: 'error',
      then: {
        function: hasParameter,
        functionOptions: {
          spec: {
            name: 'limit',
            in: 'query',
          },
          validateSchema: (schema: OpenAPIV3_0.SchemaObject, paramPath: (string | number)[]) => {
            if (!schema.type) {
              return errorMessage('Schema is missing.', paramPath);
            }

            if (schema.type !== 'integer') {
              return errorMessage('Schema type must be integer.', [...paramPath, 'schema']);
            }

            if (schema.minimum == undefined || schema.maximum === undefined || schema.default === undefined) {
              return errorMessage(
                'Integer schema must contain explicit values for "minimum", "maximum" and "default".',
                [...paramPath, 'schema']
              );
            }

            return [];
          },
        },
      },
    },
    '/req/core/fc-bbox-definition': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get',
      message: 'The operation SHALL support a parameter `bbox`. {{error}}',
      severity: 'error',
      then: {
        function: hasParameter,
        functionOptions: {
          spec: {
            name: 'bbox',
            in: 'query',
            explode: false,
            schema: {
              type: 'array',
              oneOf: [
                { minItems: 4, maxItems: 4 },
                { minItems: 6, maxItems: 6 },
              ],
              items: {
                type: 'number',
              },
            },
          },
        },
      },
    },
    '/req/core/fc-time-definition': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get',
      message: 'The operation SHALL support a parameter `datetime`. {{error}}',
      severity: 'error',
      then: {
        function: hasParameter,
        functionOptions: {
          spec: {
            name: 'datetime',
            in: 'query',
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
    '/req/core/f-op': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items\\/[^/]+$/))]',
      message:
        'For every feature in a feature collection (path `/collections/{collectionId}`), the server SHALL support the HTTP GET operation at the path `/collections/{collectionId}/items/{featureId}`.',
      severity: 'error',
      then: {
        field: 'get',
        function: truthy,
      },
    },
    '/req/core/f-response': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items\\/[^/]+$/))].get.responses',
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      severity: 'error',
      then: {
        field: '200',
        function: truthy,
      },
    },
  },
};

export default featuresCore;
