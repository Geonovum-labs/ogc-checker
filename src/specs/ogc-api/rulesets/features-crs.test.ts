import { Spectral } from '@stoplight/spectral-core';
import { clone } from 'ramda';
import { describe, expect, test } from 'vitest';
import exampleDoc from '../example.json';
import ruleset from './features-crs';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/crs/fc-md-crs-list', () => {
  test('Succeeds when the collection object schema sets the "crs" property as required', async () => {
    const oasDoc = clone(exampleDoc);
    const violations = await spectral.run(oasDoc);

    expect(violations).toHaveLength(0);
  });

  test('Fails when the collection object schema does not set the "crs" property as required', async () => {
    const oasDoc = clone(exampleDoc);
    oasDoc.components.schemas.collection.required = ['id', 'links'];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-md-crs-list', 2);
  });
});

describe('/req/crs/fc-md-storageCrs-valid-value', () => {
  test('Succeeds when the "storageCrs" and "storageCrsCoordinateEpoch" properties have valid schemas', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.schemas.collection.properties as Record<string, unknown>).storageCrs = { type: 'string', format: 'uri' };
    (oasDoc.components.schemas.collection.properties as Record<string, unknown>).storageCrsCoordinateEpoch = { type: 'number' };
    const violations = await spectral.run(oasDoc);

    expect(violations).toHaveLength(0);
  });

  test('Fails when the "storageCrs" property has an invalid schema', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.schemas.collection.properties as Record<string, unknown>).storageCrs = { type: 'number' };
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-md-storageCrs-valid-value', 2);
  });

  test('Fails when the "storageCrsCoordinateEpoch" property has an invalid schema', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.schemas.collection.properties as Record<string, unknown>).storageCrs = {
      type: 'string',
      format: 'uri',
    };
    (oasDoc.components.schemas.collection.properties as Record<string, unknown>).storageCrsCoordinateEpoch = { type: 'string' };
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-md-storageCrs-valid-value', 2);
  });

  test('Succeeds when the "storageCrs" property is absent and "storageCrsCoordinateEpoch" property is present', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.schemas.collection.properties as Record<string, unknown>).storageCrsCoordinateEpoch = { type: 'number' };
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-md-storageCrs-valid-value', 2);
  });
});
