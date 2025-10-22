import { hasSchemaMatch } from '@geonovum/standards-checker';
import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from './formats';
import { schema } from '@stoplight/spectral-functions';

export const OGC_API_RECORDS_JSON_URI = 'http://www.opengis.net/spec/ogcapi-records-1/1.0/conf/json';

export const OGC_API_RECORDS_JSON_DOC_URI = 'https://docs.ogc.org/is/20-004r1/20-004r1.html#req_records-api_';

const recordsJson: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/ogcapi-records-1/1.0/req/json',
  description: 'OGC API - Records - Part 1: Core - Requirements Class "JSON"',
  formats: [oas3_0],
  rules: {
    '/req/json/record-response': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items(\\/[^/]+)?$/))].get.responses.200.content',
      message: '200-responses of the server SHALL support the "application/geo+json" media type. {{error}}',
      documentationUrl: OGC_API_RECORDS_JSON_DOC_URI + 'record-response',
      severity: 'error',
      then: {
        function: schema,
        functionOptions: {
          schema: {
            type: 'object',
            required: ['application/geo+json'],
          },
        },
      },
    },
    '/req/json/record-content#records': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get.responses.200',
      message:
        'Every 200-response with the media type "application/geo+json" SHALL validate against the corresponding OpenAPI 3.0 schema document. {{error}}',
      documentationUrl: OGC_API_RECORDS_JSON_DOC_URI + 'record-content',
      severity: 'error',
      then: {
        function: hasSchemaMatch,
        functionOptions: {
          schemaUri:
            'https://raw.githubusercontent.com/opengeospatial/ogcapi-records/refs/heads/master/core/openapi/schemas/recordCollectionGeoJSON.yaml',
          mediaType: 'application/geo+json',
        },
      },
    },
    '/req/json/record-content#record': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items\\/[^/]+$/))].get.responses.200',
      message:
        'Every 200-response with the media type "application/geo+json" SHALL validate against the corresponding OpenAPI 3.0 schema document. {{error}}',
      documentationUrl: OGC_API_RECORDS_JSON_DOC_URI + 'record-content',
      severity: 'error',
      then: {
        function: hasSchemaMatch,
        functionOptions: {
          schemaUri:
            'https://raw.githubusercontent.com/opengeospatial/ogcapi-records/refs/heads/master/core/openapi/schemas/recordGeoJSON.yaml',
          mediaType: 'application/geo+json',
        },
      },
    },
    '/req/json/collection-response': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+$/))].get.responses.200.content',
      message: '200-responses of the server SHALL support the "application/ogc-catalog+json" media type. {{error}}',
      documentationUrl: OGC_API_RECORDS_JSON_DOC_URI + 'collection-response',
      severity: 'error',
      then: {
        function: schema,
        functionOptions: {
          schema: {
            type: 'object',
            required: ['application/ogc-catalog+json'],
          },
        },
      },
    },
    '/req/json/catalog-content': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+$/))].get.responses.200',
      message:
        'The schema of all responses with the media type application/ogc-catalog+json SHALL validate against the OpenAPI 3.0 schema. {{error}}',
      documentationUrl: OGC_API_RECORDS_JSON_DOC_URI + 'catalog-content',
      severity: 'error',
      then: {
        function: hasSchemaMatch,
        functionOptions: {
          schemaUri: 'https://raw.githubusercontent.com/opengeospatial/ogcapi-records/refs/heads/master/core/openapi/schemas/catalog.yaml',
          mediaType: 'application/ogc-catalog+json',
        },
      },
    },
  },
};

export default recordsJson;
