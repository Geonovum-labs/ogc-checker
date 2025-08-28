import { Spectral } from '@stoplight/spectral-core';
import { clone, findIndex } from 'ramda';
import { describe, expect, test } from 'vitest';
import exampleDoc from '../examples/processes.json';
import ruleset from './processes-job-list';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/job-list/job-list-op', () => {
  test('Fails when job list path is absent', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.paths as Record<string, unknown>)['/jobs'];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/job-list-op', 1);
  });
});

describe('/req/job-list/type-definition', () => {
  test('Fails when parameter is absent', async () => {
    const oasDoc = clone(exampleDoc);

    oasDoc.paths['/jobs'].get.parameters = oasDoc.paths['/jobs'].get.parameters.filter(
      param => param.$ref !== '#/components/parameters/type'
    );

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/type-definition', 1);
  });

  test('Fails when parameter has wrong type', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/type', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.type,
      schema: {
        type: 'array',
        items: {
          type: 'number',
        },
      },
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/type-definition', 1);
  });

  test('Fails when parameter is required', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/type', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.type,
      required: true,
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/type-definition', 1);
  });
});

describe('/req/job-list/processID-definition', () => {
  test('Fails when parameter is absent', async () => {
    const oasDoc = clone(exampleDoc);

    oasDoc.paths['/jobs'].get.parameters = oasDoc.paths['/jobs'].get.parameters.filter(
      param => param.$ref !== '#/components/parameters/processID-query'
    );

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/processID-definition', 1);
  });

  test('Fails when parameter has wrong type', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/processID-query', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters['processID-query'],
      schema: {
        type: 'array',
        items: {
          type: 'number',
        },
      },
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/processID-definition', 1);
  });

  test('Fails when parameter is required', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/processID-query', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters['processID-query'],
      required: true,
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/processID-definition', 1);
  });
});

describe('/req/job-list/status-definition', () => {
  test('Fails when parameter is absent', async () => {
    const oasDoc = clone(exampleDoc);

    oasDoc.paths['/jobs'].get.parameters = oasDoc.paths['/jobs'].get.parameters.filter(
      param => param.$ref !== '#/components/parameters/status'
    );

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/status-definition', 1);
  });

  test('Fails when parameter has wrong type', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/status', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.status,
      schema: {
        type: 'array',
        items: {
          type: 'number',
        },
      },
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/status-definition', 1);
  });

  test('Fails when parameter is required', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/status', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.status,
      required: true,
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/status-definition', 1);
  });
});

describe('/req/job-list/datetime-definition', () => {
  test('Fails when parameter is absent', async () => {
    const oasDoc = clone(exampleDoc);

    oasDoc.paths['/jobs'].get.parameters = oasDoc.paths['/jobs'].get.parameters.filter(
      param => param.$ref !== '#/components/parameters/datetime'
    );

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/datetime-definition', 1);
  });

  test('Fails when parameter has wrong type', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/datetime', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.datetime,
      schema: {
        type: 'number',
      },
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/datetime-definition', 1);
  });

  test('Fails when parameter is required', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/datetime', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.datetime,
      required: true,
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/datetime-definition', 1);
  });
});

describe('/req/job-list/duration-definition', () => {
  test('Fails when parameter is absent', async () => {
    const oasDoc = clone(exampleDoc);

    oasDoc.paths['/jobs'].get.parameters = oasDoc.paths['/jobs'].get.parameters.filter(
      param => param.$ref !== '#/components/parameters/minDuration'
    );

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/duration-definition#minDuration', 1);
  });

  test('Fails when parameter has wrong type', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/minDuration', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.minDuration,
      schema: {
        type: 'string',
      },
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/duration-definition#minDuration', 1);
  });

  test('Fails when parameter is required', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/minDuration', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.minDuration,
      required: true,
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/duration-definition#minDuration', 1);
  });

  test('Fails when parameter is absent', async () => {
    const oasDoc = clone(exampleDoc);

    oasDoc.paths['/jobs'].get.parameters = oasDoc.paths['/jobs'].get.parameters.filter(
      param => param.$ref !== '#/components/parameters/maxDuration'
    );

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/duration-definition#maxDuration', 1);
  });

  test('Fails when parameter has wrong type', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/maxDuration', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.maxDuration,
      schema: {
        type: 'string',
      },
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/duration-definition#maxDuration', 1);
  });

  test('Fails when parameter is required', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/maxDuration', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.maxDuration,
      required: true,
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/duration-definition#maxDuration', 1);
  });
});

describe('/req/job-list/limit-definition', () => {
  test('Fails when parameter is absent', async () => {
    const oasDoc = clone(exampleDoc);

    oasDoc.paths['/jobs'].get.parameters = oasDoc.paths['/jobs'].get.parameters.filter(
      param => param.$ref !== '#/components/parameters/limit'
    );

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/limit-definition', 1);
  });

  test('Fails when parameter has wrong type', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/limit', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.limit,
      schema: {
        type: 'string',
      },
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/limit-definition', 1);
  });

  test('Fails when parameter is required', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/limit', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.limit,
      required: true,
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/limit-definition', 1);
  });
});

describe('/req/job-list/limit-definition', () => {
  test('Fails when parameter has invalid minimum', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/limit', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.limit,
      schema: {
        ...oasDoc.components.parameters.limit.schema,
        minimum: -1,
      },
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/limit-default-minimum-maximum', 1);
  });

  test('Fails when parameter has invalid maximum', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/limit', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.limit,
      schema: {
        ...oasDoc.components.parameters.limit.schema,
        maximum: 0,
      },
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/limit-default-minimum-maximum', 1);
  });

  test('Fails when parameter has invalid default', async () => {
    const oasDoc = clone(exampleDoc);
    const paramIndex = findIndex(param => param.$ref === '#/components/parameters/limit', oasDoc.paths['/jobs'].get.parameters);

    (oasDoc.paths['/jobs'].get.parameters[paramIndex] as Record<string, unknown>) = {
      ...oasDoc.components.parameters.limit,
      schema: {
        ...oasDoc.components.parameters.limit.schema,
        default: 0,
      },
    };

    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/job-list/limit-default-minimum-maximum', 1);
  });
});
