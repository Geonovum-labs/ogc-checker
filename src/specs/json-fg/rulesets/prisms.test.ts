import { Spectral } from '@stoplight/spectral-core';
import { reject } from 'ramda';
import { describe, expect, test } from 'vitest';
import { GeometryTypes } from '../../../types';
import featureCollectionDoc from '../examples/feature-collection.json';
import featureDoc from '../examples/feature.json';
import ruleset, { JSON_FG_PRISMS_URI } from './prisms';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

const PRISM_GEOMETRY = {
  type: GeometryTypes.PRISM,
  base: {
    type: GeometryTypes.POINT,
    coordinates: [81220.15, 455113.71],
  },
  lower: 2.02,
  upper: 8.02,
};

describe('/req/prisms/metadata', () => {
  test('Succeeds when a feature place does not have type "Prism" or "MultiPrism" and does not include the Prisms conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature place has type "Prism" and does not include the Prisms conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: reject(c => c === JSON_FG_PRISMS_URI, featureDoc.conformsTo),
      place: PRISM_GEOMETRY,
    });

    expect(violations).toContainViolation('/req/prisms/metadata');
  });

  test('Fails when a feature place has type "MultiPrism" and does not include the Prisms conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: reject(c => c === JSON_FG_PRISMS_URI, featureDoc.conformsTo),
      place: {
        type: GeometryTypes.MULTIPRISM,
        prisms: [PRISM_GEOMETRY],
      },
    });

    expect(violations).toContainViolation('/req/prisms/metadata');
  });

  test('Fails when a feature collection contains a feature place of type "Prism" and does not include the Prisms conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      conformsTo: reject(c => c === JSON_FG_PRISMS_URI, featureDoc.conformsTo),
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: PRISM_GEOMETRY,
        },
      ],
    });

    expect(violations).toContainViolation('/req/prisms/metadata');
  });

  test('Fails when a feature collection contains a feature place of type "MultiPPrism" and does not include the Prisms conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      conformsTo: reject(c => c === JSON_FG_PRISMS_URI, featureDoc.conformsTo),
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.MULTIPRISM,
            prisms: [PRISM_GEOMETRY],
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/prisms/metadata');
  });
});

describe('/req/prisms/coordinates', () => {
  test('Succeeds when a feature place has type "Prism" and the coordinate dimension is 3', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: [...featureDoc.conformsTo, JSON_FG_PRISMS_URI],
      place: PRISM_GEOMETRY,
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when a feature place has type "MultiPrism" and the coordinate dimension is 2', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: [...featureDoc.conformsTo, JSON_FG_PRISMS_URI],
      place: {
        type: GeometryTypes.MULTIPRISM,
        prisms: [PRISM_GEOMETRY],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature place has type "Prism" and the coordinate dimension is not 2', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: [...featureDoc.conformsTo, JSON_FG_PRISMS_URI],
      place: {
        ...PRISM_GEOMETRY,
        base: {
          ...PRISM_GEOMETRY.base,
          coordinates: [81220.15, 455113.71, 100],
        },
      },
    });

    expect(violations).toContainViolation('/req/prisms/coordinates#A');
  });

  test('Fails when a feature place has type "MultiPrism" and the coordinate dimension is not 2', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: [...featureDoc.conformsTo, JSON_FG_PRISMS_URI],
      place: {
        type: GeometryTypes.MULTIPRISM,
        prisms: [
          {
            ...PRISM_GEOMETRY,
            base: {
              ...PRISM_GEOMETRY.base,
              coordinates: [81220.15, 455113.71, 100],
            },
          },
        ],
      },
    });

    expect(violations).toContainViolation('/req/prisms/coordinates#A');
  });

  test('Succeeds when a feature place has type "Prism" with measures and the coordinate dimension is 3', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: [...featureDoc.conformsTo, JSON_FG_PRISMS_URI],
      measures: { enabled: true },
      place: {
        ...PRISM_GEOMETRY,
        base: {
          ...PRISM_GEOMETRY.base,
          coordinates: [81220.15, 455113.71, 100, 100],
        },
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when a feature place has type "MultiPrism" with measures and the coordinate dimension is 3', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: [...featureDoc.conformsTo, JSON_FG_PRISMS_URI],
      measures: { enabled: true },
      place: {
        type: GeometryTypes.MULTIPRISM,
        prisms: [
          {
            ...PRISM_GEOMETRY,
            base: {
              ...PRISM_GEOMETRY.base,
              coordinates: [81220.15, 455113.71, 100, 100],
            },
          },
        ],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature place has type "Prism" with measures and the coordinate dimension is not 3', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: [...featureDoc.conformsTo, JSON_FG_PRISMS_URI],
      measures: { enabled: true },
      place: {
        ...PRISM_GEOMETRY,
        base: {
          ...PRISM_GEOMETRY.base,
          coordinates: [81220.15, 455113.71],
        },
      },
    });

    expect(violations).toContainViolation('/req/prisms/coordinates#A');
  });

  test('Fails when a feature place has type "MultiPrism" with measures and the coordinate dimension is not 3', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: [...featureDoc.conformsTo, JSON_FG_PRISMS_URI],
      measures: { enabled: true },
      place: {
        type: GeometryTypes.MULTIPRISM,
        prisms: [
          {
            ...PRISM_GEOMETRY,
            base: {
              ...PRISM_GEOMETRY.base,
              coordinates: [81220.15, 455113.71],
            },
          },
        ],
      },
    });

    expect(violations).toContainViolation('/req/prisms/coordinates#A');
  });

  test('Fails when a feature place has type "Prism" and lower value is greater than upper value', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: [...featureDoc.conformsTo, JSON_FG_PRISMS_URI],
      place: {
        ...PRISM_GEOMETRY,
        lower: 11,
        upper: 10,
      },
    });

    expect(violations).toContainViolation('/req/prisms/coordinates#C');
  });

  test('Fails when a feature place has type "MultiPrism" and lower value is greater than upper value', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: [...featureDoc.conformsTo, JSON_FG_PRISMS_URI],
      place: {
        type: GeometryTypes.MULTIPRISM,
        prisms: [
          {
            ...PRISM_GEOMETRY,
            lower: 11,
            upper: 10,
          },
        ],
      },
    });

    expect(violations).toContainViolation('/req/prisms/coordinates#C');
  });
});
