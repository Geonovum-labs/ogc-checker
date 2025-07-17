import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from '@stoplight/spectral-formats';
import { schema } from '@stoplight/spectral-functions';

export const OGC_API_PROCESSES_JSON_URI = 'http://www.opengis.net/spec/ogcapi-processes-1/1.0/conf/json';

export const OGC_API_PROCESSES_JSON_DOC_URI = 'https://docs.ogc.org/DRAFTS/18-062r3.html#';

const processesJson: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/ogcapi-processes-1/1.0/req/json',
  description: 'OGC API - Processes - Part 1: Core - Requirements Class "JSON"',
  formats: [oas3_0],
  rules: {
    '/req/json/definition': {
      given: [
        '$.paths["/"].get.responses.200.content',
        '$.paths["/conformance"].get.responses.200.content',
        '$.paths[?(@property.match(/^\\/processes(\\/[^/]+)?$/))].get.responses.200.content',
        '$.paths[?(@property.match(/^\\/jobs\\/[^/]+$/))].get.responses.200.content',
      ],
      message: '200-responses of the server SHALL support the "application/json" media type. {{error}}',
      documentationUrl: OGC_API_PROCESSES_JSON_DOC_URI + 'req_json_definition',
      severity: 'error',
      then: {
        function: schema,
        functionOptions: {
          schema: {
            type: 'object',
            required: ['application/json'],
          },
        },
      },
    },
  },
};

export default processesJson;
