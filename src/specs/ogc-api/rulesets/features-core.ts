import { hasParameter, OpenAPIV3_0 } from '@geonovum/standards-checker';
import { errorMessage } from '@geonovum/standards-checker/engine/util';
import type { IFunctionResult, RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from './formats';
import { truthy } from '@stoplight/spectral-functions';

export const OGC_API_FEATURES_CORE_URI = 'http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/core';

export const OGC_API_FEATURES_CORE_DOC_URI = 'https://docs.ogc.org/is/17-069r3/17-069r3.html#req_core_';

const featuresCore: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/ogcapi-features-1/1.0/req/core',
  description: 'OGC API - Features - Part 1: Core - Requirements Class "Core"',
  formats: [oas3_0],
  rules: {
    '/req/core/root-op': {
      given: '$.paths',
      message: 'The server SHALL support the HTTP GET operation at the path `/`.',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'root-op',
      severity: 'error',
      then: {
        field: '/.get',
        function: truthy,
      },
    },
    '/req/core/root-success': {
      given: "$.paths['/'].get.responses",
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'root-success',
      severity: 'error',
      then: {
        field: '200',
        function: truthy,
      },
    },
    '/req/core/conformance-op': {
      given: '$.paths',
      message: 'The server SHALL support the HTTP GET operation at the path `/conformance`.',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'conformance-op',
      severity: 'error',
      then: {
        field: '/conformance.get',
        function: truthy,
      },
    },
    '/req/core/conformance-success': {
      given: "$.paths['/conformance'].get.responses",
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'conformance-success',
      severity: 'error',
      then: {
        field: '200',
        function: truthy,
      },
    },
    '/req/core/fc-md-op': {
      given: '$.paths',
      message: 'The server SHALL support the HTTP GET operation at the path `/collections`.',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'fc-md-op',
      severity: 'error',
      then: {
        field: '/collections.get',
        function: truthy,
      },
    },
    '/req/core/fc-md-success': {
      given: "$.paths['/collections'].get.responses",
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'fc-md-success',
      severity: 'error',
      then: {
        field: '200',
        function: truthy,
      },
    },
    '/req/core/sfc-md-op': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+$/))]',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'sfc-md-op',
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
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'sfc-md-success',
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
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'fc-op',
      severity: 'error',
      then: {
        field: 'get',
        function: truthy,
      },
    },
    '/req/core/fc-response': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get.responses',
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'fc-response',
      severity: 'error',
      then: {
        field: '200',
        function: truthy,
      },
    },
    '/req/core/fc-limit-definition': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get',
      message: 'The operation SHALL support a parameter `limit`. {{error}}',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'fc-limit-definition',
      severity: 'error',
      then: {
        function: hasParameter,
        functionOptions: {
          spec: {
            name: 'limit',
            in: 'query',
          },
          validateSchema: (schema: OpenAPIV3_0.SchemaObject, paramPath: (string | number)[]): IFunctionResult[] => {
            if (!schema.type) {
              return errorMessage('Schema is missing.', paramPath);
            }

            if (schema.type !== 'integer') {
              return errorMessage('Schema type must be integer.', [...paramPath, 'schema']);
            }

            if (schema.minimum == undefined || schema.maximum === undefined || schema.default === undefined) {
              return errorMessage('Integer schema must contain explicit values for "minimum", "maximum" and "default".', [
                ...paramPath,
                'schema',
              ]);
            }

            return [];
          },
        },
      },
    },
    '/req/core/fc-bbox-definition': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get',
      message: 'The operation SHALL support a parameter `bbox`. {{error}}',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'fc-bbox-definition',
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
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'fc-time-definition',
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
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'f-op',
      severity: 'error',
      then: {
        field: 'get',
        function: truthy,
      },
    },
    '/req/core/f-response': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items\\/[^/]+$/))].get.responses',
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'f-response',
      severity: 'error',
      then: {
        field: '200',
        function: truthy,
      },
    },
  },
};

export default featuresCore;
