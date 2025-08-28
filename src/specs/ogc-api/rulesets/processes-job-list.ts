import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';

export const OGC_API_PROCESSES_JOB_LIST_URI = 'http://www.opengis.net/spec/ogcapi-processes-1/1.0/conf/job-list';

export const OGC_API_PROCESSES_JOB_LIST_DOC_URI = 'https://docs.ogc.org/DRAFTS/18-062r3.html#req_job-list_';

const processesJobList: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/ogcapi-processes-1/1.0/req/job-list',
  description: 'OGC API - Processes - Part 1: Core - Requirements Class "Job list"',
  formats: [oas3_0],
  rules: {
    '/req/job-list/job-list-op': {
      given: '$.paths',
      message: 'The server SHALL support the HTTP GET operation at the path `/jobs`.',
      documentationUrl: OGC_API_PROCESSES_JOB_LIST_DOC_URI + 'job-list-op',
      severity: 'error',
      then: {
        field: '/jobs.get',
        function: truthy,
      },
    },
  },
};

export default processesJobList;
