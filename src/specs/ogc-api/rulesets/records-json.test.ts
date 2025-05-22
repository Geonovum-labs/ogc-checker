import { Spectral } from '@stoplight/spectral-core';
import { clone } from 'ramda';
import { describe, expect, test } from 'vitest';
import exampleDoc from '../examples/records.json';
import ruleset from './records-json';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/json/record-response', () => {
  test('Fails when record content has an invalid schema', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.responses.Record.content as Record<string, unknown>)['application/geo+json'];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/json/record-response', 1);
  });

  test('Fails when records content has an invalid schema', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.responses.Records.content as Record<string, unknown>)['application/geo+json'];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/json/record-response', 1);
  });
});

describe('/req/json/record-content#records', () => {
  test('Fails when records content has an invalid schema', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.schemas.recordCollectionGeoJSON as Record<string, unknown>).required;
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/json/record-content#records', 1);
  });
});

describe('/req/json/record-content#record', () => {
  test('Fails when record content has an invalid schema', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.schemas.recordGeoJSON as Record<string, unknown>).required;
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/json/record-content#record', 1);
  });
});

describe('/req/json/collection-response', () => {
  test('Fails when collection content has an invalid schema', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.responses.Collection.content as Record<string, unknown>)['application/ogc-catalog+json'];
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/json/collection-response', 1);
  });
});

describe('/req/json/catalog-content', () => {
  test('Fails when catalog content has an invalid schema', async () => {
    const oasDoc = clone(exampleDoc);
    delete (oasDoc.components.schemas.recordCollection.allOf[1] as Record<string, unknown>).required;
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/json/catalog-content', 1);
  });
});
