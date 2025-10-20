import { hasSchemaMatch, hasParameter, OpenAPIV3_0, hasPathMatch } from '@geonovum/standards-checker';
import { errorMessage } from '@geonovum/standards-checker/engine/util';
import type { IFunctionResult, RulesetDefinition } from '@stoplight/spectral-core';
import { oas3_0 } from '@stoplight/spectral-formats';
import { truthy } from '@stoplight/spectral-functions';


export const OGC_API_PROCESSES_CORE_URI = 'http://www.opengis.net/spec/ogcapi-processes-1/1.0/conf/core';

export const OGC_API_PROCESSES_CORE_DOC_URI = 'https://docs.ogc.org/DRAFTS/18-062r3.html#/req_core_';

const GIT_COMMIT_OR_TAG = '6a4656d90ecad5c349cf984e920f9048fef76190';

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
          function: hasSchemaMatch,
          functionOptions: {
            schemaUri: `https://raw.githubusercontent.com/opengeospatial/ogcapi-processes/${GIT_COMMIT_OR_TAG}/openapi/schemas/common-core/landingPage.yaml`,
          },
        },
      ],
    },
    '/req/core/conformance-op': {
      given: '$.paths',
      message: 'The server SHALL support the HTTP GET operation at the path `/conformance`.',
      documentationUrl: OGC_API_PROCESSES_CORE_DOC_URI + 'conformance-op',
      severity: 'error',
      then: {
        field: '/conformance.get',
        function: truthy,
      },
    },
    '/req/core/conformance-success': {
      given: "$.paths['/conformance'].get.responses",
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      documentationUrl: OGC_API_PROCESSES_CORE_DOC_URI + 'conformance-success',
      severity: 'error',
      then: [
        {
          field: '200',
          function: truthy,
        },
        {
          field: '200',
          function: hasSchemaMatch,
          functionOptions: {
            schemaUri: `https://raw.githubusercontent.com/opengeospatial/ogcapi-processes/${GIT_COMMIT_OR_TAG}/openapi/schemas/common-core/confClasses.yaml`,
          },
        },
      ],
    },
    '/req/core/process-list': {
      given: '$.paths',
      message: 'The server SHALL support the HTTP GET operation at the path `/processes`.',
      documentationUrl: OGC_API_PROCESSES_CORE_DOC_URI + 'process-list',
      severity: 'error',
      then: {
        field: '/processes.get',
        function: truthy,
      },
    },
    '/req/core/pl-limit-definition': {
      given: "$.paths['/processes'].get",
      message: 'The operation SHALL support a parameter `limit`. {{error}}',
      documentationUrl: OGC_API_PROCESSES_CORE_DOC_URI + 'pl-limit-definition',
      severity: 'error',
      then: {
        function: hasParameter,
        functionOptions: {
          spec: {
            name: 'limit',
            in: 'query',
          },
          validateSchema: (schema: OpenAPIV3_0.SchemaObject, paramPath: (string | number)[]): IFunctionResult[] => {
            if (!schema.type) {
              return errorMessage('Schema is missing.', paramPath);
            }

            if (schema.type !== 'integer') {
              return errorMessage('Schema type must be integer.', [...paramPath, 'schema']);
            }

            if (schema.minimum == undefined || schema.maximum === undefined || schema.default === undefined) {
              return errorMessage('Integer schema must contain explicit values for "minimum", "maximum" and "default".', [
                ...paramPath,
                'schema',
              ]);
            }

            return [];
          },
        },
      },
    },
    '/req/core/process-list-success': {
      given: "$.paths['/processes'].get.responses",
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      documentationUrl: OGC_API_PROCESSES_CORE_DOC_URI + 'process-list-success',
      severity: 'error',
      then: [
        {
          field: '200',
          function: truthy,
        },
        {
          field: '200',
          function: hasSchemaMatch,
          functionOptions: {
            schemaUri: `https://raw.githubusercontent.com/opengeospatial/ogcapi-processes/${GIT_COMMIT_OR_TAG}/openapi/schemas/processes-core/processList.yaml`,
          },
        },
      ],
    },
    '/req/core/process-description': {
      given: '$.paths',
      documentationUrl: OGC_API_PROCESSES_CORE_DOC_URI + 'process-description',
      message: 'The server SHALL support the HTTP GET operation at the path `/processes/{processID}`.',
      severity: 'error',
      then: {
        function: hasPathMatch,
        functionOptions: {
          pattern: '^\\/processes\\/[^/]+$',
        },
      },
    },
    '/req/core/process-description#get': {
      given: '$.paths[?(@property.match(/^\\/processes\\/[^/]+$/))]',
      documentationUrl: OGC_API_PROCESSES_CORE_DOC_URI + 'process-description',
      message: 'The server SHALL support the HTTP GET operation at the path `/processes/{processID}`.',
      severity: 'error',
      then: {
        field: 'get',
        function: truthy,
      },
    },
    '/req/core/process-description-success': {
      given: '$.paths[?(@property.match(/^\\/processes\\/[^/]+$/))].get.responses',
      message: 'A successful execution of the operation SHALL be reported as a response with a HTTP status code `200`.',
      documentationUrl: OGC_API_PROCESSES_CORE_DOC_URI + 'process-description-success',
      severity: 'error',
      then: {
        field: '200',
        function: truthy,
      },
    },
    '/req/core/process-exception/no-such-process': {
      given: '$.paths[?(@property.match(/^\\/processes\\/[^/]+$/))].get.responses',
      message: 'If the operation is executed using an invalid process identifier, the response SHALL be HTTP status code `404`.',
      documentationUrl: OGC_API_PROCESSES_CORE_DOC_URI + 'process-exception-no-such-process',
      severity: 'error',
      then: [
        {
          field: '404',
          function: truthy,
        },
        {
          field: '404',
          function: hasSchemaMatch,
          functionOptions: {
            schemaUri: `https://raw.githubusercontent.com/opengeospatial/ogcapi-processes/${GIT_COMMIT_OR_TAG}/openapi/schemas/common-core/exception.yaml`,
          },
        },
      ],
    },
    '/req/core/process-execute-op': {
      given: '$.paths',
      documentationUrl: OGC_API_PROCESSES_CORE_DOC_URI + 'process-execute-op',
      message: 'The server SHALL support the HTTP POST operation at the path `/processes/{processID}/execution`.',
      severity: 'error',
      then: {
        function: hasPathMatch,
        functionOptions: {
          pattern: '^\\/processes\\/[^/]+\\/execution$',
        },
      },
    },
    '/req/core/process-execute-op#post': {
      given: '$.paths[?(@property.match(/^\\/processes\\/[^/]+\\/execution$/))]',
      documentationUrl: OGC_API_PROCESSES_CORE_DOC_URI + 'process-execute-op',
      message: 'The server SHALL support the HTTP POST operation at the path `/processes/{processID}/execution`.',
      severity: 'error',
      then: {
        field: 'post',
        function: truthy,
      },
    },
    '/req/core/process-execute-request': {
      given: '$.paths[?(@property.match(/^\\/processes\\/[^/]+\\/execution$/))].post',
      message: 'The content of the request body SHALL be based upon the corresponding OpenAPI 3.0 schema document.',
      documentationUrl: OGC_API_PROCESSES_CORE_DOC_URI + 'process-execute-request',
      severity: 'error',
      then: [
        {
          field: 'requestBody',
          function: truthy,
        },
        {
          field: 'requestBody',
          function: hasSchemaMatch,
          functionOptions: {
            schemaUri: `https://raw.githubusercontent.com/opengeospatial/ogcapi-processes/${GIT_COMMIT_OR_TAG}/openapi/schemas/processes-core/execute.yaml`,
          },
        },
        {
          field: 'requestBody.required',
          function: truthy,
        },
      ],
    },
  },
};

export default processesCore;
