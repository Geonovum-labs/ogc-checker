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
