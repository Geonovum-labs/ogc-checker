import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';
import { oasDocumentSchema, oasPathParam } from '@stoplight/spectral-rulesets/dist/oas/functions';
import { APPLICATION_GEO_JSON_TYPE } from '../../constants';
import hasParameter from '../../functions/hasParameter';
import responseMatchSchema from '../../functions/responseMatchSchema';
import { OpenAPIV3_0 } from '../../openapi-types';
import { errorMessage } from '../../util';

const ruleset: RulesetDefinition = {
  documentationUrl: 'https://ogcapi.ogc.org/features/',
  description: 'OGC API - Features',
  formats: [oas3_0],
  rules: {
    '/req/oas30/oas-definition-2': {
      given: '$',
      message: 'The JSON representation SHALL conform to the OpenAPI Specification, version 3.0. {{error}}.',
      severity: 'error',
      then: [
        {
          function: oasDocumentSchema,
        },
        {
          field: 'paths',
          function: oasPathParam,
        },
      ],
    },
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
      message:
        'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`. {{error}}',
      severity: 'error',
      then: {
        field: '200',
        function: responseMatchSchema,
        functionOptions: {
          schemaUri: 'https://schemas.opengis.net/ogcapi/features/part1/1.0/openapi/schemas/landingPage.yaml',
        },
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
      message:
        'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`. {{error}}',
      severity: 'error',
      then: {
        field: '200',
        function: responseMatchSchema,
        functionOptions: {
          schemaUri: 'https://schemas.opengis.net/ogcapi/features/part1/1.0/openapi/schemas/confClasses.yaml',
        },
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
      message:
        'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`. {{error}}',
      severity: 'error',
      then: {
        field: '200',
        function: responseMatchSchema,
        functionOptions: {
          schemaUri: 'https://schemas.opengis.net/ogcapi/features/part1/1.0/openapi/schemas/collections.yaml',
        },
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
      message:
        'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`. {{error}}',
      severity: 'error',
      then: {
        field: '200',
        function: responseMatchSchema,
        functionOptions: {
          schemaUri: 'https://schemas.opengis.net/ogcapi/features/part1/1.0/openapi/schemas/collection.yaml',
        },
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
      message:
        'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`. {{error}}',
      severity: 'error',
      then: {
        field: '200',
        function: responseMatchSchema,
        functionOptions: {
          schemaUri:
            'https://schemas.opengis.net/ogcapi/features/part1/1.0/openapi/schemas/featureCollectionGeoJSON.yaml',
          mediaType: APPLICATION_GEO_JSON_TYPE,
        },
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
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items\\/[^/]$/))]',
      message:
        'For every feature in a feature collection (path `/collections/{collectionId}`), the server SHALL support the HTTP GET operation at the path `/collections/{collectionId}/items/{featureId}`.',
      severity: 'error',
      then: {
        field: 'get',
        function: truthy,
      },
    },
    '/req/core/f-response': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items\\/[^/]$/))].get.responses',
      message:
        'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`. {{error}}',
      severity: 'error',
      then: {
        field: '200',
        function: responseMatchSchema,
        functionOptions: {
          schemaUri: 'https://schemas.opengis.net/ogcapi/features/part1/1.0/openapi/schemas/featureGeoJSON.yaml',
          mediaType: APPLICATION_GEO_JSON_TYPE,
        },
      },
    },
  },
};

export default ruleset;
