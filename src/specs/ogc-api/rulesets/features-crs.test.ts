import { Spectral } from '@stoplight/spectral-core';
import { describe, expect, test } from 'vitest';
import oasDocument from '../example.json';
import ruleset from './features-crs';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/crs/fc-md-crs-list', () => {
  test('Succeeds when the collection object schema sets the "crs" property as required', async () => {
    const violations = await spectral.run(oasDocument);

    expect(violations).toHaveLength(0);
  });

  test('Fails when the collection object schema does not set the "crs" property as required', async () => {
    oasDocument.components.schemas.collection.required = ['id', 'links'];
    const violations = await spectral.run(oasDocument);

    expect(violations).toContainViolation('/req/crs/fc-md-crs-list', 2);
  });
});
