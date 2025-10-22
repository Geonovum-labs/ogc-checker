import { RulesetDefinition } from '@stoplight/spectral-core';
import { schema } from '@stoplight/spectral-functions';
import { GeometryTypes } from '../../../types';

export const JSON_FG_CIRCULAR_ARCS_URI = 'http://www.opengis.net/spec/json-fg-1/0.3/conf/circular-arcs';

export const JSON_FG_CIRCULAR_ARCS_DOC_URI = 'https://docs.ogc.org/DRAFTS/21-045.html#circular-arcs_';

const CIRCULAR_ARC_TYPES = [
  GeometryTypes.CIRCULARSTRING,
  GeometryTypes.COMPOUNDCURVE,
  GeometryTypes.CURVEPOLYGON,
  GeometryTypes.MULTICURVE,
  GeometryTypes.MULTISURFACE,
];

const circularArcs: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.3/req/circular-arcs',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Circular Arcs"',
  rules: {
    '/req/circular-arcs/metadata': {
      given: '$',
      documentationUrl: JSON_FG_CIRCULAR_ARCS_DOC_URI + 'metadata',
      severity: 'error',
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
                          enum: CIRCULAR_ARC_TYPES,
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
                                enum: CIRCULAR_ARC_TYPES,
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
                    const: JSON_FG_CIRCULAR_ARCS_URI,
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

export default circularArcs;
