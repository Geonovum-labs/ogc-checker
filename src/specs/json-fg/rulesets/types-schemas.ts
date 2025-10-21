import { RulesetDefinition } from '@stoplight/spectral-core';
import { schema } from '@stoplight/spectral-functions';
import { isValidGeometryDimension } from '../functions/isValidGeometryDimension';
import { remoteSchema } from '@geonovum/standards-checker';

export const JSON_FG_TYPES_SCHEMAS_URI = 'http://www.opengis.net/spec/json-fg-1/0.3/conf/types-schemas';

export const JSON_FG_TYPES_SCHEMAS_DOC_URI = 'https://docs.ogc.org/DRAFTS/21-045.html#types-schemas_';

const typesSchemas: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.3/req/types-schemas',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Feature Types and Schemas"',
  rules: {
    '/req/types-schemas/metadata': {
      given: '$',
      documentationUrl: JSON_FG_TYPES_SCHEMAS_DOC_URI + 'metadata',
      severity: 'error',
      then: {
        function: schema,
        functionOptions: {
          schema: {
            if: {
              anyOf: [
                { required: ['featureType'] },
                { required: ['featureSchema'] },
                {
                  properties: {
                    features: {
                      contains: {
                        anyOf: [{ required: ['featureType'] }, { required: ['featureSchema'] }],
                      },
                    },
                  },
                },
              ],
            },
            then: {
              properties: {
                conformsTo: {
                  contains: {
                    const: JSON_FG_TYPES_SCHEMAS_URI,
                  },
                },
              },
            },
          },
        },
      },
    },
    '/req/types-schemas/feature-type': {
      given: '$',
      documentationUrl: JSON_FG_TYPES_SCHEMAS_DOC_URI + 'feature-type',
      severity: 'error',
      then: {
        function: remoteSchema,
        functionOptions: {
          schema: {
            type: 'object',
            discriminator: { propertyName: 'type' },
            oneOf: [
              {
                required: ['type', 'featureType'],
                properties: {
                  type: {
                    const: 'Feature',
                  },
                },
              },
              {
                required: ['type'],
                properties: {
                  type: {
                    const: 'FeatureCollection',
                  },
                },
                oneOf: [
                  { required: ['featureType'] },
                  {
                    properties: {
                      features: {
                        type: 'array',
                        items: {
                          type: 'object',
                          required: ['featureType'],
                        },
                      },
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    },
    '/req/types-schemas/geometry-dimension': {
      given: '$',
      documentationUrl: JSON_FG_TYPES_SCHEMAS_DOC_URI + 'geometry-dimension',
      severity: 'error',
      then: {
        function: isValidGeometryDimension,
      },
    },
  },
};

export default typesSchemas;