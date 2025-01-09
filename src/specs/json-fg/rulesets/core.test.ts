import { Spectral } from '@stoplight/spectral-core';
import { describe, expect, test } from 'vitest';
import { CC_3D_URI } from './3d';
import ruleset, { CC_CORE_CURIE, CC_CORE_URI } from './core';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

const feature = {
  type: 'Feature',
  time: null,
  place: null,
  geometry: null,
  properties: null,
};

const featureCollection = {
  type: 'FeatureCollection',
  features: [feature],
};

describe('/req/core/schema-valid', () => {
  test('Fails when required properties are absent on feature', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      place: undefined,
    });

    expect(violations).toContainViolation('/req/core/schema-valid', /Object must have required property "place"\.$/);
  });

  test('Fails when required properties are absent on feature collection', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [CC_CORE_URI],
      features: undefined,
    });

    expect(violations).toContainViolation('/req/core/schema-valid', /Object must have required property "features"\.$/);
  });
});

describe('/req/core/metadata', () => {
  test('Fails when the "conformsTo" member of a feature is absent', async () => {
    const violations = await spectral.run({
      ...feature,
    });

    expect(violations).toContainViolation('/req/core/metadata#A');
  });

  test('Fails when the "conformsTo" member of a feature collection is absent', async () => {
    const violations = await spectral.run({
      ...featureCollection,
    });

    expect(violations).toContainViolation('/req/core/metadata#A');
  });

  test('Succeeds when the "conformsTo" member of a feature contains the core URI', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when the "conformsTo" member of a feature contains the core CURIE', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_CURIE],
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when the "conformsTo" member of a feature collection contains the core URI', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [CC_CORE_URI],
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when the "conformsTo" member of a feature collection contains the core CURIE', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [CC_CORE_CURIE],
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when the "conformsTo" member of a feature does not contain the core URI/CURIE', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_3D_URI],
    });

    expect(violations).toContainViolation('/req/core/metadata#B');
  });

  test('Fails when the "conformsTo" member of a feature collection does not contain the core URI/CURIE', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [CC_3D_URI],
    });

    expect(violations).toContainViolation('/req/core/metadata#B');
  });

  test('Fails when a member feature of a feature collection contains a "conformsTo" member', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [CC_CORE_URI],
      features: [
        {
          ...feature,
          conformsTo: [CC_CORE_URI],
        },
      ],
    });

    expect(violations).toContainViolation('/req/core/metadata#C');
  });
});
