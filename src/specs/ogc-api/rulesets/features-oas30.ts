import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from '@stoplight/spectral-formats';
import { oasDocumentSchema, oasPathParam } from '@stoplight/spectral-rulesets/dist/oas/functions';

export const OGC_API_FEATURES_OAS3_URI = 'http://www.opengis.net/spec/ogcapi-features-1/1.0/conf/oas30';

const featuresOas30: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/ogcapi-features-1/1.0/req/oas30',
  description: 'OGC API - Features - Part 1: Core - Requirements Class "OpenAPI 3.0"',
  formats: [oas3_0],
  rules: {
    '/req/oas30/oas-definition-2': {
      given: '$',
      message: 'The JSON representation SHALL conform to the OpenAPI Specification, version 3.0. {{error}}.',
      severity: 'error',
      then: [
        {
          function: oasDocumentSchema,
        },
        {
          field: 'paths',
          function: oasPathParam,
        },
      ],
    },
  },
};

export default featuresOas30;
