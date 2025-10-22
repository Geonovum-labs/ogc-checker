/* eslint-disable @typescript-eslint/no-explicit-any */
import { RulesetDefinition } from '@stoplight/spectral-core';
import { schema } from '@stoplight/spectral-functions';
import { GEOJSON_TYPES } from '../../../types';
import { hasDimensions } from '../functions/hasDimensions';
import { isFeature, isFeatureCollection } from '../functions/util';

export const JSON_FG_MEASURES_URI = 'http://www.opengis.net/spec/json-fg-1/0.3/conf/measures';

export const JSON_FG_MEASURES_DOC_URI = 'https://docs.ogc.org/DRAFTS/21-045.html#measures_';

const measures: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.3/req/measures',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Measures"',
  rules: {
    '/req/measures/metadata': {
      given: '$',
      documentationUrl: JSON_FG_MEASURES_DOC_URI + 'metadata',
      severity: 'error',
      message: `The "conformsTo" member of a JSON-FG root object that contains a "measures" member in any JSON-FG object SHALL include the value "${JSON_FG_MEASURES_URI}".`,
      then: {
        function: schema,
        functionOptions: {
          schema: {
            if: {
              required: ['measures'],
              properties: {
                measures: {},
              },
            },
            then: {
              properties: {
                conformsTo: {
                  contains: {
                    const: JSON_FG_MEASURES_URI,
                  },
                },
              },
            },
          },
        },
      },
    },
    '/req/measures/coordinates': {
      given: '$',
      documentationUrl: JSON_FG_MEASURES_DOC_URI + 'coordinates',
      severity: 'error',
      then: {
        function: (input, _options, context) => {
          const validateFeature = (feature: any, path: (string | number)[]) => {
            if (!GEOJSON_TYPES.includes(input.place?.type)) {
              return;
            }

            const place = feature.place;
            const numDimensions = place.measures?.enabled || feature.measures?.enabled || input.measures?.enabled ? 3 : 2;

            return hasDimensions(
              input.place,
              {
                numDimensions,
                errorMessage:
                  'If a JSON-FG geometry has m coordinates, each position SHALL have three coordinates (in case of a 2D CRS) or four coordinates (in case of a 3D CRS).',
                path,
              },
              context
            );
          };

          if (isFeature(input)) {
            return validateFeature(input, ['place', 'coordinates']);
          }

          if (isFeatureCollection(input) && Array.isArray(input.features)) {
            return input.features.flatMap(
              (feature: any, index: number) => validateFeature(feature, ['features', index, 'place', 'coordinates']) || []
            );
          }
        },
      },
    },
  },
};

export default measures;
