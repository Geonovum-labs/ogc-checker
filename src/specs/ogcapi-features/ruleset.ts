import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';
import { oas } from '@stoplight/spectral-rulesets';
import responseMatchSchema from '../../functions/responseMatchSchema';

const ruleset: RulesetDefinition = {
  documentationUrl: 'https://ogcapi.ogc.org/features/',
  description: 'OGC API - Features',
  formats: [oas3_0],
  rules: {
    '/req/oas30/oas-definition-2': {
      ...oas.rules['oas3-schema'],
      message: 'The JSON representation SHALL conform to the OpenAPI Specification, version 3.0. {{error}}.',
    },
    '/req/core/root-op': {
      given: '$.paths',
      message: 'The server SHALL support the HTTP GET operation at the path `/`.',
      severity: 'error',
      then: {
        field: '/.get',
        function: truthy,
      },
    },
    '/req/core/root-success': {
      given: "$.paths['/'].get.responses",
      message:
        'A successful execution of the operation SHALL be reported as a response with a HTTP status code 200. {{error}}',
      then: [
        {
          field: '200',
          function: responseMatchSchema,
          functionOptions: {
            schemaUri: 'https://schemas.opengis.net/ogcapi/features/part1/1.0/openapi/schemas/landingPage.yaml',
          },
        },
      ],
    },
  },
};

export default ruleset;
