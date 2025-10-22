import { Spectral } from '@stoplight/spectral-core';
import { reject } from 'ramda';
import { describe, expect, test } from 'vitest';
import { GeometryTypes } from '../../../types';
import featureCollectionDoc from '../examples/feature-collection.json';
import featureDoc from '../examples/feature.json';
import ruleset, { JSON_FG_MEASURES_URI } from './measures';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/measures/metadata', () => {
  test('Succeeds when a feature does not contain a "measures" member and does not include the Measures conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: reject(c => c === JSON_FG_MEASURES_URI, featureDoc.conformsTo),
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when a feature collection does not contain a "measures" member and does not include the Measures conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      conformsTo: reject(c => c === JSON_FG_MEASURES_URI, featureDoc.conformsTo),
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature contains a "measures" member and does not include the Measures conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: reject(c => c === JSON_FG_MEASURES_URI, featureDoc.conformsTo),
      measures: {
        enabled: true,
      },
    });

    expect(violations).toContainViolation('/req/measures/metadata');
  });

  test('Fails when a feature collection contains a "measures" member and does not include the Measures conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      conformsTo: reject(c => c === JSON_FG_MEASURES_URI, featureDoc.conformsTo),
      measures: {
        enabled: true,
      },
    });

    expect(violations).toContainViolation('/req/measures/metadata');
  });
});

describe('/req/measures/coordinates', () => {
  test('Succeeds when a feature place has type "Point" and the coordinate dimension is 2', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: [...featureDoc.conformsTo, JSON_FG_MEASURES_URI],
      place: {
        type: GeometryTypes.POINT,
        coordinates: [10, 20],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when a feature place has type "Point" with measures and the coordinate dimension is 3', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: [...featureDoc.conformsTo, JSON_FG_MEASURES_URI],
      measures: { enabled: true },
      place: {
        type: GeometryTypes.POINT,
        coordinates: [10, 20, 30],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature place has type "Point" and the coordinate dimension is not 2', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: [...featureDoc.conformsTo, JSON_FG_MEASURES_URI],
      place: {
        type: GeometryTypes.POINT,
        coordinates: [10, 20, 30],
      },
    });

    expect(violations).toContainViolation('/req/measures/coordinates');
  });

  test('Fails when a feature place has type "Point" with measures and the coordinate dimension is not 3', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: [...featureDoc.conformsTo, JSON_FG_MEASURES_URI],
      measures: { enabled: true },
      place: {
        type: GeometryTypes.POINT,
        coordinates: [10, 20],
      },
    });

    expect(violations).toContainViolation('/req/measures/coordinates');
  });
});
