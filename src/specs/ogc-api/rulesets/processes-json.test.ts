import { Spectral } from '@stoplight/spectral-core';
import { clone } from 'ramda';
import { describe, expect, test } from 'vitest';
import exampleDoc from '../examples/processes.json';
import ruleset from './processes-json';
import { APPLICATION_JSON_TYPE } from '@geonovum/standards-checker';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/json/definition', () => {
  test('Fails when landing page does not support media type "application/json".', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.responses.LandingPage.content as Record<string, unknown>)[APPLICATION_JSON_TYPE];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/json/definition', 1);
  });

  test('Fails when conformance does not support media type "application/json".', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.responses.Conformance.content as Record<string, unknown>)[APPLICATION_JSON_TYPE];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/json/definition', 1);
  });

  test('Fails when process list does not support media type "application/json".', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.responses.ProcessList.content as Record<string, unknown>)[APPLICATION_JSON_TYPE];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/json/definition', 1);
  });

  test('Fails when process description does not support media type "application/json".', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.responses.ProcessDescription.content as Record<string, unknown>)[APPLICATION_JSON_TYPE];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/json/definition', 1);
  });

  test('Fails when sync execution result does not support media type "application/json".', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.responses.ExecuteSync.content as Record<string, unknown>)[APPLICATION_JSON_TYPE];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/json/definition', 1);
  });

  test('Fails when job status does not support media type "application/json".', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.responses.JobStatus.content as Record<string, unknown>)[APPLICATION_JSON_TYPE];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/json/definition', 1);
  });
});
