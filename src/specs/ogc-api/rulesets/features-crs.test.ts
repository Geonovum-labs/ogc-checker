import { Spectral } from '@stoplight/spectral-core';
import { clone } from 'ramda';
import { describe, expect, test } from 'vitest';
import exampleDoc from '../example.json';
import ruleset from './features-crs';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/crs/fc-md-crs-list', () => {
  test('Succeeds when the collection schema sets the "crs" property as required', async () => {
    const oasDoc = clone(exampleDoc);
    const violations = await spectral.run(oasDoc);

    expect(violations).toHaveLength(0);
  });

  test('Fails when the collection schema does not set the "crs" property as required', async () => {
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

describe('/req/crs/fc-bbox-crs-definition', () => {
  test('Succeeds when the features GET operation supports a "bbox-crs" query-parameter with a valid schema', async () => {
    const oasDoc = clone(exampleDoc);
    const violations = await spectral.run(oasDoc);

    expect(violations).toHaveLength(0);
  });

  test('Fails when the features GET operation does not support a "bbox-crs" query-parameter', async () => {
    const oasDoc = clone(exampleDoc);
    oasDoc.components.parameters['bbox-crs'].name = 'foo';
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-bbox-crs-definition', 1);
  });

  test('Fails when the features GET operation supports a "bbox-crs" query-parameter which is required', async () => {
    const oasDoc = clone(exampleDoc);
    oasDoc.components.parameters['bbox-crs'].required = true;
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-bbox-crs-definition', 1);
  });

  test('Fails when the features GET operation supports a "bbox-crs" path-parameter', async () => {
    const oasDoc = clone(exampleDoc);
    oasDoc.components.parameters['bbox-crs'].in = 'path';
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-bbox-crs-definition', 1);
  });

  test('Fails when the features GET operation supports a "bbox-crs" parameter with an invalid schema', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.parameters['bbox-crs'].schema as unknown) = { type: 'number' };
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-bbox-crs-definition', 1);
  });

  test('Fails when the features GET operation supports a "bbox-crs" parameter with a valid schema without default', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.parameters['bbox-crs'].schema as Record<string, unknown>).default = undefined;
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-bbox-crs-definition', 1);
  });

  test('Fails when the features GET operation supports a "bbox-crs" parameter with a valid schema with a non-CRS84 default', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.parameters['bbox-crs'].schema as Record<string, unknown>).default = 'http://www.opengis.net/def/crs/EPSG/0/4326';
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-bbox-crs-definition', 1);
  });
});

describe('/req/crs/fc-bbox-crs-valid-value', () => {
  test('Succeeds when the features GET operation supports a 400 response', async () => {
    const oasDoc = clone(exampleDoc);
    const violations = await spectral.run(oasDoc);

    expect(violations).toHaveLength(0);
  });

  test('Fails when the features GET operation does not support a 400 response', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.paths['/collections/{collectionId}/items'].get.responses[400] as unknown) = undefined;
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-bbox-crs-valid-value', 1);
  });
});

describe('/req/crs/fc-crs-definition', () => {
  test('Succeeds when the features GET operation supports a "crs" query-parameter with a valid schema', async () => {
    const oasDoc = clone(exampleDoc);
    const violations = await spectral.run(oasDoc);

    expect(violations).toHaveLength(0);
  });

  test('Fails when the features GET operation does not support a "crs" query-parameter', async () => {
    const oasDoc = clone(exampleDoc);
    oasDoc.components.parameters['crs'].name = 'foo';
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-crs-definition', 2);
  });

  test('Fails when the features GET operation supports a "crs" query-parameter which is required', async () => {
    const oasDoc = clone(exampleDoc);
    oasDoc.components.parameters['crs'].required = true;
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-crs-definition', 2);
  });

  test('Fails when the features GET operation supports a "crs" path-parameter', async () => {
    const oasDoc = clone(exampleDoc);
    oasDoc.components.parameters['crs'].in = 'path';
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-crs-definition', 2);
  });

  test('Fails when the features GET operation supports a "crs" parameter with an invalid schema', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.parameters['crs'].schema as unknown) = { type: 'number' };
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-crs-definition', 2);
  });

  test('Fails when the features GET operation supports a "crs" parameter with a valid schema without default', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.parameters['crs'].schema as Record<string, unknown>).default = undefined;
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-crs-definition', 2);
  });

  test('Fails when the features GET operation supports a "crs" parameter with a valid schema with a non-CRS84 default', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.parameters['crs'].schema as Record<string, unknown>).default = 'http://www.opengis.net/def/crs/EPSG/0/4326';
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/fc-crs-definition', 2);
  });
});

describe('/req/crs/ogc-crs-header', () => {
  test('Succeeds when the features GET operation supports a "Content-Crs" response header', async () => {
    const oasDoc = clone(exampleDoc);
    const violations = await spectral.run(oasDoc);

    expect(violations).toHaveLength(0);
  });

  test('Fails when the features GET operation does not support a "crs" query-parameter', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.responses.Features.headers['Content-Crs'] as unknown) = undefined;
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/ogc-crs-header', 1);
  });

  test('Fails when the feature GET operation does not support a "crs" query-parameter', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.responses.Feature.headers['Content-Crs'] as unknown) = undefined;
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/ogc-crs-header', 1);
  });

  test('Fails when the "crs" query-parameter specifies a format.', async () => {
    const oasDoc = clone(exampleDoc);
    (oasDoc.components.headers['Content-Crs'].schema as Record<string, unknown>).format = 'uri';
    const violations = await spectral.run(oasDoc);

    expect(violations).toContainViolation('/req/crs/ogc-crs-header', 2);
  });
});
