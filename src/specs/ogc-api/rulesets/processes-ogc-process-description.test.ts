import { Spectral } from '@stoplight/spectral-core';
import { clone } from 'ramda';
import { describe, expect, test } from 'vitest';
import exampleDoc from '../examples/processes.json';
import ruleset from './processes-ogc-process-description';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/ogc-process-description/json-encoding', () => {
  test('Fails when process description has an invalid schema', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.schemas.processSummary.allOf[1].properties as Record<string, unknown>).version;
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/ogc-process-description/json-encoding', 1);
  });
});
