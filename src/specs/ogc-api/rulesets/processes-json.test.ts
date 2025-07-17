import { Spectral } from '@stoplight/spectral-core';
import { clone } from 'ramda';
import { describe, expect, test } from 'vitest';
import { APPLICATION_JSON_TYPE } from '../../../constants';
import exampleDoc from '../examples/processes.json';
import ruleset from './processes-json';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/json/definition', () => {
  test('Fails when process list has an invalid schema', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.responses.ProcessList.content as Record<string, unknown>)[APPLICATION_JSON_TYPE];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/json/definition', 1);
  });

  test('Fails when process description has an invalid schema', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.responses.ProcessDescription.content as Record<string, unknown>)[APPLICATION_JSON_TYPE];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/json/definition', 1);
  });
});
