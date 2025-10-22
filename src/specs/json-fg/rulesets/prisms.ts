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
      then: {
        function: schema,
        functionOptions: {
          schema: {
            if: {
              anyOf: [
                {
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
                {
                  properties: {
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
      given: ['$..place'],
      documentationUrl: JSON_FG_PRISMS_DOC_URI + 'coordinates',
      severity: 'error',
      then: {
        function: (input, _options, context) => {
          if (GeometryTypes.PRISM === input.type && input.base) {
            const numDimensions = input.base.measures?.enabled ? 3 : 2;
            return hasDimensions(input.base, { numDimensions }, context);
          }

          if (GeometryTypes.MULTIPRISM === input.type && Array.isArray(input.prisms)) {
            for (const prism of input.prisms) {
              if (GeometryTypes.PRISM === prism.type && prism.base) {
                const numDimensions = prism.base.measures?.enabled ? 3 : 2;
                return hasDimensions(prism.base, { numDimensions }, context);
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
