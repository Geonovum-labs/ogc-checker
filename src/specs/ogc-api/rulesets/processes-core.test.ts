import { Spectral } from '@stoplight/spectral-core';
import { clone } from 'ramda';
import { describe, expect, test } from 'vitest';
import exampleDoc from '../examples/processes.json';
import ruleset from './processes-core';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/core/landingpage-op', () => {
  test('Fails when landing page path is absent', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.paths as Record<string, unknown>)['/'];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/core/landingpage-op', 1);
  });
});

describe('/req/core/landingpage-success', () => {
  test('Fails when landing page success response is absent', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.paths['/'].get.responses as Record<string, unknown>)['200'];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/core/landingpage-success', 1);
  });

  test('Fails when landing page response schema is invalid', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.schemas.landingPage as Record<string, unknown>).required = [];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/core/landingpage-success', 1);
  });
});

describe('/req/core/conformance-op', () => {
  test('Fails when conformance path is absent', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.paths as Record<string, unknown>)['/conformance'];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/core/conformance-op', 1);
  });
});

describe('/req/core/conformance-success', () => {
  test('Fails when conformance success response is absent', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.paths['/conformance'].get.responses as Record<string, unknown>)['200'];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/core/conformance-success', 1);
  });

  test('Fails when conformance response schema is invalid', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.schemas.confClasses as Record<string, unknown>).required = [];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/core/conformance-success', 1);
  });
});
