import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from '@stoplight/spectral-formats';
import { schema } from '@stoplight/spectral-functions';
import responseMatchSchema from '../../../functions/responseMatchSchema';

export const OGC_API_RECORDS_JSON_URI = 'http://www.opengis.net/spec/ogcapi-records-1/1.0/conf/json';

const recordsJson: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/ogcapi-records-1/1.0/req/json',
  description: 'OGC API - Records - Part 1: Core - Requirements Class "JSON"',
  formats: [oas3_0],
  rules: {
    '/req/json/record-response': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items(\\/[^/]+)?$/))].get.responses.200.content',
      message: '200-responses of the server SHALL support the "application/geo+json" media type. {{error}}',
      severity: 'error',
      then: {
        function: schema,
        functionOptions: {
          schema: {
            type: 'object',
            required: ['application/geo+json; application=ogc-record'],
          },
        },
      },
    },
    '/req/json/record-content#records': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get.responses.200',
      message:
        'Every 200-response with the media type application/geo+json SHALL validate against the corresponding OpenAPI 3.0 schema document. {{error}}',
      severity: 'error',
      then: {
        function: responseMatchSchema,
        functionOptions: {
          // Revert user to "opengeospatial" and branch to "master" once issue is resolved: https://github.com/opengeospatial/ogcapi-records/pull/467
          schemaUri:
            'https://raw.githubusercontent.com/joostfarla/ogcapi-records/refs/heads/temp/core/openapi/schemas/recordCollectionGeoJSON.yaml',
          mediaType: 'application/geo+json; application=ogc-record',
        },
      },
    },
    '/req/json/record-content#record': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items\\/[^/]+$/))].get.responses.200',
      message:
        'Every 200-response with the media type application/geo+json SHALL validate against the corresponding OpenAPI 3.0 schema document. {{error}}',
      severity: 'error',
      then: {
        function: responseMatchSchema,
        functionOptions: {
          // Revert user to "opengeospatial" and branch to "master" once issue is resolved: https://github.com/opengeospatial/ogcapi-records/pull/466
          schemaUri: 'https://raw.githubusercontent.com/joostfarla/ogcapi-records/refs/heads/temp/core/openapi/schemas/recordGeoJSON.yaml',
          mediaType: 'application/geo+json; application=ogc-record',
        },
      },
    },
  },
};

export default recordsJson;
