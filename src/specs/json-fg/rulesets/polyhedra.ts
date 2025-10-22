import { RulesetDefinition } from '@stoplight/spectral-core';
import { schema } from '@stoplight/spectral-functions';
import { GeometryTypes } from '../../../types';
import { hasDimensions } from '../functions/hasDimensions';

export const JSON_FG_POLYHEDRA_URI = 'http://www.opengis.net/spec/json-fg-1/0.3/conf/polyhedra';

export const JSON_FG_POLYHEDRA_DOC_URI = 'https://docs.ogc.org/DRAFTS/21-045.html#polyhedra_';

const POLYHEDRON_TYPES = [GeometryTypes.POLYHEDRON, GeometryTypes.MULTIPOLYHEDRON];

const polyhedra: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.3/req/polyhedra',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Polyhedra"',
  rules: {
    '/req/polyhedra/metadata': {
      given: '$',
      documentationUrl: JSON_FG_POLYHEDRA_DOC_URI + 'metadata',
      severity: 'error',
      message: `The "conformsTo" member of a JSON-FG root object that contains any of the polyhedron geometry types SHALL include the value "${JSON_FG_POLYHEDRA_URI}".`,
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
                          enum: POLYHEDRON_TYPES,
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
                                enum: POLYHEDRON_TYPES,
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
                    const: JSON_FG_POLYHEDRA_URI,
                  },
                },
              },
            },
          },
        },
      },
    },
    '/req/polyhedra/coordinates': {
      given: '$',
      documentationUrl: JSON_FG_POLYHEDRA_DOC_URI + 'coordinates',
      severity: 'error',
      then: {
        function: (input, _options, context) => {
          if (POLYHEDRON_TYPES.includes(input.place?.type)) {
            const numDimensions = input.measures?.enabled ? 4 : 3;

            return hasDimensions(
              input.place,
              {
                numDimensions,
                errorMessage:
                  'All positions in a "Polyhedron" or "MultiPolyhedron" geometry (JSON-FG geometry with "type" set to "Polyhedron" or "MultiPolyhedron") SHALL have a coordinate dimension of three (3) - or four (4), if measure values are included.',
                path: ['place', 'coordinates'],
              },
              context
            );
          }
        },
      },
    },
  },
};

export default polyhedra;
