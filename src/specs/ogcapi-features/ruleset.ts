import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';
import { oas } from '@stoplight/spectral-rulesets';
import type { OpenAPIV3 } from 'openapi-types';
import { APPLICATION_JSON_TYPE } from '../../constants';
import { errorMessage } from '../../util';

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
          function: (response?: OpenAPIV3.ResponseObject) => {
            if (!response) {
              return errorMessage('A response with status code 200 is missing.');
            }

            if (response.content && response.content[APPLICATION_JSON_TYPE]) {
              const schema = response.content[APPLICATION_JSON_TYPE].schema as OpenAPIV3.SchemaObject | undefined;

              if (!schema) {
                return errorMessage('Response schema for JSON media type is missing.');
              }

              if (schema.type !== 'object') {
                return errorMessage('Response schema for JSON media type is not an object schema.');
              }

              if (!schema.required?.includes('links')) {
                return errorMessage('Response schema for JSON media type does not set `links` property as required.');
              }

              const linksValue = schema.properties?.links as OpenAPIV3.SchemaObject | undefined;

              if (!linksValue || linksValue.type !== 'array') {
                return errorMessage(
                  'Response schema for JSON media type does not have a `links` property, ' +
                    'or the `links` property schema is not an array schema.'
                );
              }
            }
          },
        },
      ],
    },
  },
};

export default ruleset;
