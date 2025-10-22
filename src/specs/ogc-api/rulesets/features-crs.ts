import { hasSchemaMatch } from '@geonovum/standards-checker';
import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from './formats';
import { schema, truthy } from '@stoplight/spectral-functions';

export const OGC_API_FEATURES_CRS_URI = 'http://www.opengis.net/spec/ogcapi-features-2/1.0/conf/crs';

export const OGC_API_FEATURES_CRS_DOC_URI = 'https://docs.ogc.org/is/18-058r1/18-058r1.html#req_crs_';

const featuresCrs: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/ogcapi-features-2/1.0/req/crs',
  description:
    'OGC API - Features - Part 2: Coordinate Reference Systems by Reference - Requirements Class "Coordinate Reference Systems by Reference"',
  formats: [oas3_0],
  rules: {
    '/req/crs/fc-md-crs-list#collections': {
      given: "$.paths['/collections'].get.responses.200",
      message:
        'The crs property in the collection object of a spatial feature collection SHALL contain the identifiers for the list of CRSs ' +
        'supported by the server for that collection. {{error}}',
      documentationUrl: OGC_API_FEATURES_CRS_DOC_URI + 'fc-md-crs-list',
      severity: 'error',
      then: {
        function: hasSchemaMatch,
        functionOptions: {
          schema: {
            type: 'object',
            properties: {
              collections: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['crs'],
                },
              },
            },
          },
        },
      },
    },
    '/req/crs/fc-md-crs-list#collection': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+$/))].get.responses.200',
      message:
        'The crs property in the collection object of a spatial feature collection SHALL contain the identifiers for the list of CRSs ' +
        'supported by the server for that collection. {{error}}',
      documentationUrl: OGC_API_FEATURES_CRS_DOC_URI + 'fc-md-crs-list',
      severity: 'error',
      then: {
        function: hasSchemaMatch,
        functionOptions: {
          schema: {
            type: 'object',
            required: ['crs'],
          },
        },
      },
    },
    '/req/crs/fc-md-storageCrs-valid-value#collections': {
      given: "$.paths['/collections'].get.responses.200",
      message:
        'The value of the storageCrs property SHALL be one of the CRS identifiers from the list of supported CRS identifiers found in the ' +
        'collection object using the crs property. {{error}}',
      documentationUrl: OGC_API_FEATURES_CRS_DOC_URI + 'fc-md-storageCrs-valid-value',
      severity: 'error',
      then: {
        function: hasSchemaMatch,
        functionOptions: {
          schema: {
            type: 'object',
            properties: {
              collections: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    storageCrs: {
                      type: 'string',
                      format: 'uri',
                    },
                    storageCrsCoordinateEpoch: {
                      type: 'number',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/req/crs/fc-md-storageCrs-valid-value#collection': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+$/))].get.responses.200',
      message:
        'The value of the storageCrs property SHALL be one of the CRS identifiers from the list of supported CRS identifiers found in the ' +
        'collection object using the crs property. {{error}}',
      documentationUrl: OGC_API_FEATURES_CRS_DOC_URI + 'fc-md-storageCrs-valid-value',
      severity: 'error',
      then: {
        function: hasSchemaMatch,
        functionOptions: {
          schema: {
            type: 'object',
            properties: {
              storageCrs: {
                type: 'string',
                format: 'uri',
              },
              storageCrsCoordinateEpoch: {
                type: 'number',
              },
            },
          },
        },
      },
    },
    '/req/crs/fc-bbox-crs-definition': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get',
      message: "Each GET request on a 'features' resource SHALL support a query parameter bbox-crs. {{error}}",
      documentationUrl: OGC_API_FEATURES_CRS_DOC_URI + 'fc-bbox-crs-definition',
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
                      required: ['type', 'format', 'default'],
                      properties: {
                        type: { const: 'string' },
                        format: { const: 'uri' },
                        default: { enum: ['http://www.opengis.net/def/crs/OGC/1.3/CRS84', 'http://www.opengis.net/def/crs/OGC/0/CRS84h'] },
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
    '/req/crs/fc-bbox-crs-valid-value': {
      given: '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get.responses',
      message:
        'If the value of the bbox-crs parameter is not one of the CRS identifiers from the list of supported CRS identifiers, then the ' +
        'server SHALL respond with the HTTP status code 400. {{error}}',
      documentationUrl: OGC_API_FEATURES_CRS_DOC_URI + 'fc-bbox-crs-valid-value',
      severity: 'error',
      then: {
        field: '400',
        function: truthy,
      },
    },
    '/req/crs/fc-crs-definition': {
      given: [
        '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get',
        '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items\\/[^/]+$/))].get',
      ],
      message: "Each GET request on a 'features' or 'feature' resource SHALL support a query parameter named crs. {{error}}",
      documentationUrl: OGC_API_FEATURES_CRS_DOC_URI + 'fc-crs-definition',
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
                    name: { const: 'crs' },
                    in: { const: 'query' },
                    required: { const: false },
                    schema: {
                      type: 'object',
                      required: ['type', 'format', 'default'],
                      properties: {
                        type: { const: 'string' },
                        format: { const: 'uri' },
                        default: { enum: ['http://www.opengis.net/def/crs/OGC/1.3/CRS84', 'http://www.opengis.net/def/crs/OGC/0/CRS84h'] },
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
    '/req/crs/ogc-crs-header': {
      given: [
        '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items$/))].get.responses.200',
        '$.paths[?(@property.match(/^\\/collections\\/[^/]+\\/items\\/[^/]+$/))].get.responses.200',
      ],
      message: "Each GET request on a 'features' or 'feature' resource SHALL support a query parameter named crs. {{error}}",
      documentationUrl: OGC_API_FEATURES_CRS_DOC_URI + 'ogc-crs-header',
      severity: 'error',
      then: {
        function: schema,
        functionOptions: {
          schema: {
            $schema: 'https://json-schema.org/draft/2020-12/schema',
            type: 'object',
            required: ['headers'],
            properties: {
              headers: {
                type: 'object',
                required: ['Content-Crs'],
                properties: {
                  'Content-Crs': {
                    type: 'object',
                    required: ['schema'],
                    properties: {
                      schema: {
                        type: 'object',
                        required: ['type'],
                        properties: {
                          type: { const: 'string' },
                        },
                        not: { required: ['format'] },
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
