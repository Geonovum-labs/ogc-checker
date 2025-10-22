import { RulesetDefinition } from '@stoplight/spectral-core';
import { schema } from '@stoplight/spectral-functions';

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
  },
};

export default measures;
