import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from './formats';
import { OGC_API_FEATURES_CORE_DOC_URI } from './features-core';
import { APPLICATION_GEO_JSON_TYPE, hasSchemaMatch } from '@geonovum/standards-checker';

export const OGC_API_FEATURES_GEOJSON_URI = 'http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/geojson';

const featuresGeoJson: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/ogcapi-features-1/1.0/req/geojson',
  description: 'OGC API - Features - Part 1: Core - Requirements Class "GeoJSON"',
  formats: [oas3_0],
  rules: {
    '/req/core/root-success': {
      given: "$.paths['/'].get.responses.200",
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`. {{error}}',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'root-success',
      severity: 'error',
      then: {
        function: hasSchemaMatch,
        functionOptions: {
          schemaUri: 'https://schemas.opengis.net/ogcapi/features/part1/1.0/openapi/schemas/landingPage.yaml',
        },
      },
    },
    '/req/core/conformance-success': {
      given: "$.paths['/conformance'].get.responses.200",
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`. {{error}}',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'conformance-success',
      severity: 'error',
      then: {
        function: hasSchemaMatch,
        functionOptions: {
          schemaUri: 'https://schemas.opengis.net/ogcapi/features/part1/1.0/openapi/schemas/confClasses.yaml',
        },
      },
    },
    '/req/core/fc-md-success': {
      given: "$.paths['/collections'].get.responses.200",
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`. {{error}}',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'fc-md-success',
      severity: 'error',
      then: {
        function: hasSchemaMatch,
        functionOptions: {
          schemaUri: 'https://schemas.opengis.net/ogcapi/features/part1/1.0/openapi/schemas/collections.yaml',
        },
      },
    },
    '/req/core/sfc-md-success': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+$/))].get.responses.200',
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`. {{error}}',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'sfc-md-success',
      severity: 'error',
      then: {
        function: hasSchemaMatch,
        functionOptions: {
          schemaUri: 'https://schemas.opengis.net/ogcapi/features/part1/1.0/openapi/schemas/collection.yaml',
        },
      },
    },
    '/req/core/fc-response': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get.responses.200',
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`. {{error}}',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'fc-response',
      severity: 'error',
      then: {
        function: hasSchemaMatch,
        functionOptions: {
          schemaUri: 'https://schemas.opengis.net/ogcapi/features/part1/1.0/openapi/schemas/featureCollectionGeoJSON.yaml',
          mediaType: APPLICATION_GEO_JSON_TYPE,
        },
      },
    },
    '/req/core/f-response': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items\\/[^/]+$/))].get.responses.200',
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`. {{error}}',
      documentationUrl: OGC_API_FEATURES_CORE_DOC_URI + 'f-response',
      severity: 'error',
      then: {
        function: hasSchemaMatch,
        functionOptions: {
          schemaUri: 'https://schemas.opengis.net/ogcapi/features/part1/1.0/openapi/schemas/featureGeoJSON.yaml',
          mediaType: APPLICATION_GEO_JSON_TYPE,
        },
      },
    },
  },
};

export default featuresGeoJson;
