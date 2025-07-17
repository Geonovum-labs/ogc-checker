import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';
import responseMatchSchema from '../../../functions/responseMatchSchema';

export const OGC_API_PROCESSES_CORE_URI = 'http://www.opengis.net/spec/ogcapi-processes-1/1.0/conf/core';

export const OGC_API_PROCESSES_CORE_DOC_URI = 'https://docs.ogc.org/DRAFTS/18-062r3.html#/req_core_';

const processesCore: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/ogcapi-processes-1/1.0/req/core',
  description: 'OGC API - Processes - Part 1: Core - Requirements Class "Core"',
  formats: [oas3_0],
  rules: {
    '/req/core/landingpage-op': {
      given: '$.paths',
      message: 'The server SHALL support the HTTP GET operation at the path `/`.',
      documentationUrl: OGC_API_PROCESSES_CORE_DOC_URI + 'landingpage-op',
      severity: 'error',
      then: {
        field: '/.get',
        function: truthy,
      },
    },
    '/req/core/landingpage-success': {
      given: "$.paths['/'].get.responses",
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      documentationUrl: OGC_API_PROCESSES_CORE_DOC_URI + 'landingpage-success',
      severity: 'error',
      then: [
        {
          field: '200',
          function: truthy,
        },
        {
          field: '200',
          function: responseMatchSchema,
          functionOptions: {
            schemaUri:
              'https://raw.githubusercontent.com/opengeospatial/ogcapi-processes/master/openapi/schemas/common-core/landingPage.yaml',
          },
        },
      ],
    },
  },
};

export default processesCore;
