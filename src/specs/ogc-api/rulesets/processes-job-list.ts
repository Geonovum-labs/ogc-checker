import type { RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';
import hasParameter from '../../../functions/hasParameter';

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
    '/req/job-list/type-definition': {
      given: '$.paths[/jobs].get',
      message: 'The operation SHALL support a parameter `type`.',
      documentationUrl: OGC_API_PROCESSES_JOB_LIST_DOC_URI + 'type-definition',
      severity: 'error',
      then: {
        function: hasParameter,
        functionOptions: {
          spec: {
            name: 'type',
            in: 'query',
            required: false,
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    '/req/job-list/processID-definition': {
      given: '$.paths[/jobs].get',
      message: 'The operation SHALL support a parameter `processID`.',
      documentationUrl: OGC_API_PROCESSES_JOB_LIST_DOC_URI + 'processID-definition',
      severity: 'error',
      then: {
        function: hasParameter,
        functionOptions: {
          spec: {
            name: 'processID',
            in: 'query',
            required: false,
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    '/req/job-list/status-definition': {
      given: '$.paths[/jobs].get',
      message: 'The operation SHALL support a parameter `status`.',
      documentationUrl: OGC_API_PROCESSES_JOB_LIST_DOC_URI + 'status-definition',
      severity: 'error',
      then: {
        function: hasParameter,
        functionOptions: {
          spec: {
            name: 'status',
            in: 'query',
            required: false,
            schema: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    '/req/job-list/datetime-definition': {
      given: '$.paths[/jobs].get',
      message: 'The operation SHALL support a parameter `datetime`.',
      documentationUrl: OGC_API_PROCESSES_JOB_LIST_DOC_URI + 'datetime-definition',
      severity: 'error',
      then: {
        function: hasParameter,
        functionOptions: {
          spec: {
            name: 'datetime',
            in: 'query',
            required: false,
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
    '/req/job-list/duration-definition#minDuration': {
      given: '$.paths[/jobs].get',
      message: 'The operation SHALL support a parameter `minDuration`.',
      documentationUrl: OGC_API_PROCESSES_JOB_LIST_DOC_URI + 'duration-definition',
      severity: 'error',
      then: {
        function: hasParameter,
        functionOptions: {
          spec: {
            name: 'minDuration',
            in: 'query',
            required: false,
            schema: {
              type: 'integer',
            },
          },
        },
      },
    },
    '/req/job-list/duration-definition#maxDuration': {
      given: '$.paths[/jobs].get',
      message: 'The operation SHALL support a parameter `maxDuration`.',
      documentationUrl: OGC_API_PROCESSES_JOB_LIST_DOC_URI + 'duration-definition',
      severity: 'error',
      then: {
        function: hasParameter,
        functionOptions: {
          spec: {
            name: 'maxDuration',
            in: 'query',
            required: false,
            schema: {
              type: 'integer',
            },
          },
        },
      },
    },
  },
};

export default processesJobList;
