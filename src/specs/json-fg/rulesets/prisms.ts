import { RulesetDefinition } from '@stoplight/spectral-core';
import { schema } from '@stoplight/spectral-functions';
import { GeometryTypes } from '../../../types';
import { errorMessage } from '../../../util';
import { hasDimensions } from '../functions/hasDimensions';

export const JSON_FG_PRISMS_URI = 'http://www.opengis.net/spec/json-fg-1/0.3/conf/prisms';

export const JSON_FG_PRISMS_DOC_URI = 'https://docs.ogc.org/DRAFTS/21-045.html#prisms_';

const PRISM_TYPES = [GeometryTypes.PRISM, GeometryTypes.MULTIPRISM];

const prisms: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.3/req/prisms',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Prims"',
  rules: {
    '/req/prisms/metadata': {
      given: '$',
      documentationUrl: JSON_FG_PRISMS_DOC_URI + 'metadata',
      severity: 'error',
      message: `The "conformsTo" member of a JSON-FG root object that contains any of the prism geometry types SHALL include the value "${JSON_FG_PRISMS_URI}".`,
      then: {
        function: schema,
        functionOptions: {
          schema: {
            if: {
              anyOf: [
                {
                  required: ['type'],
                  properties: {
                    type: {
                      const: 'Feature',
                    },
                    place: {
                      properties: {
                        type: {
                          enum: PRISM_TYPES,
                        },
                      },
                    },
                  },
                },
                {
                  required: ['type'],
                  properties: {
                    type: {
                      const: 'FeatureCollection',
                    },
                    features: {
                      contains: {
                        properties: {
                          place: {
                            properties: {
                              type: {
                                enum: PRISM_TYPES,
                              },
                            },
                          },
                        },
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
                    const: JSON_FG_PRISMS_URI,
                  },
                },
              },
            },
          },
        },
      },
    },
    '/req/prisms/coordinates#A': {
      given: '$',
      documentationUrl: JSON_FG_PRISMS_DOC_URI + 'coordinates',
      severity: 'error',
      then: {
        function: (input, _options, context) => {
          const numDimensions = input.measures?.enabled ? 3 : 2;
          const place = input.place ?? {};

          if (GeometryTypes.PRISM === place.type && place.base) {
            return hasDimensions(
              place.base,
              {
                numDimensions,
                errorMessage:
                  'All positions in the "base" member of a JSON-FG geometry of type "Prism" SHALL have a coordinate dimension of two (2) - or three (3), if measure values are included.',
                path: ['place', 'base'],
              },
              context
            );
          }

          if (GeometryTypes.MULTIPRISM === place.type && Array.isArray(place.prisms)) {
            for (const [index, prism] of place.prisms.entries()) {
              if (GeometryTypes.PRISM === prism.type && prism.base) {
                return hasDimensions(
                  prism.base,
                  {
                    numDimensions,
                    errorMessage:
                      'All positions in the "base" member of a JSON-FG geometry of type "Prism" SHALL have a coordinate dimension of two (2) - or three (3), if measure values are included.',
                    path: ['place', 'prisms', index, 'base'],
                  },
                  context
                );
              }
            }
          }
        },
      },
    },
    '/req/prisms/coordinates#C': {
      given: ['$..place'],
      documentationUrl: JSON_FG_PRISMS_DOC_URI + 'coordinates',
      severity: 'error',
      then: {
        function: input => {
          if (
            GeometryTypes.PRISM === input.type &&
            typeof input.lower === 'number' &&
            typeof input.upper === 'number' &&
            input.lower > input.upper
          ) {
            return errorMessage('In a Prism, the "lower" value SHALL be equal or smaller than the "upper" value.');
          }

          if (GeometryTypes.MULTIPRISM === input.type && Array.isArray(input.prisms)) {
            for (const prism of input.prisms) {
              if (
                GeometryTypes.PRISM === prism.type &&
                typeof prism.lower === 'number' &&
                typeof prism.upper === 'number' &&
                prism.lower > prism.upper
              ) {
                return errorMessage('In a Prism, the "lower" value SHALL be equal or smaller than the "upper" value.');
              }
            }
          }
        },
      },
    },
  },
};

export default prisms;
