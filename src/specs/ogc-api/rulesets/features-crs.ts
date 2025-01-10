import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from '@stoplight/spectral-formats';
import { errorMessage } from '../../../util';

export const OGC_API_FEATURES_CRS_URI = 'http://www.opengis.net/spec/ogcapi-features-2/1.0/conf/crs';

const featuresCrs: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/ogcapi-features-2/1.0/req/crs',
  description:
    'OGC API - Features - Part 2: Coordinate Reference Systems by Reference - Requirements Class "Coordinate Reference Systems by Reference"',
  formats: [oas3_0],
  rules: {
    '/req/crs/fc-md-crs-list': {
      given: [
        "$.paths['/collections'].get.responses.200.content[application/json].schema.properties.collections.items",
        '$.paths[?(@property.match(/^\\/collections\\/[^/]+$/))].get.responses.200.content[application/json].schema',
      ],
      severity: 'error',
      then: {
        function: input => {
          if (!(typeof input === 'object')) {
            return;
          }

          if (!('required' in input) || !Array.isArray(input.required) || !input.required.includes('crs')) {
            return errorMessage('The "crs" property must be set as required.');
          }
        },
      },
    },
  },
};

export default featuresCrs;
