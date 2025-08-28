import { Spectral } from '@stoplight/spectral-core';
import { clone } from 'ramda';
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
