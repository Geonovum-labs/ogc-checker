import { Spectral } from '@stoplight/spectral-core';
import { reject } from 'ramda';
import { describe, expect, test } from 'vitest';
import { GeometryTypes } from '../../../types';
import featureCollectionDoc from '../examples/feature-collection.json';
import featureDoc from '../examples/feature.json';
import ruleset, { JSON_FG_POLYHEDRA_URI } from './polyhedra';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/polyhedra/metadata', () => {
  test('Succeeds when a feature place does not have type "Polyhedron" or "MultiPolygon" and does not include the Polyhedra conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      place: {
        type: GeometryTypes.POINT,
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature place has type "Polyhedron" and does not include the Polyhedra conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: reject(c => c === JSON_FG_POLYHEDRA_URI, featureDoc.conformsTo),
    });

    expect(violations).toContainViolation('/req/polyhedra/metadata');
  });

  test('Fails when a feature place has type "MultiPolyhedron" and does not include the Polyhedra conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: reject(c => c === JSON_FG_POLYHEDRA_URI, featureDoc.conformsTo),
      place: {
        type: GeometryTypes.MULTIPOLYHEDRON,
      },
    });

    expect(violations).toContainViolation('/req/polyhedra/metadata');
  });

  test('Fails when a feature collection contains a feature of type "Polyhedron" and does not include the Polyhedra conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      conformsTo: reject(c => c === JSON_FG_POLYHEDRA_URI, featureDoc.conformsTo),
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.POLYHEDRON,
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/polyhedra/metadata');
  });

  test('Fails when a feature collection contains a feature of type "MultiPolyhedron" and does not include the Polyhedra conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      conformsTo: reject(c => c === JSON_FG_POLYHEDRA_URI, featureDoc.conformsTo),
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.MULTIPOLYHEDRON,
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/polyhedra/metadata');
  });
});

describe('/req/polyhedra/coordinates', () => {
  test('Succeeds when a feature place has type "Polyhedron" and the coordinate dimension is 3', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      place: {
        type: GeometryTypes.POLYHEDRON,
        coordinates: [[[[[479816.67, 5705861.672, 100]]]]],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when a feature place has type "MultiPolyhedron" and the coordinate dimension is 3', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      place: {
        type: GeometryTypes.MULTIPOLYHEDRON,
        coordinates: [[[[[[479816.67, 5705861.672, 100]]]]]],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature place has type "Polyhedron" and the coordinate dimension is not 3', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      place: {
        type: GeometryTypes.POLYHEDRON,
        coordinates: [[[[[479816.67, 5705861.672]]]]],
      },
    });

    expect(violations).toContainViolation('/req/polyhedra/coordinates');
  });

  test('Fails when a feature place has type "MultiPolyhedron" and the coordinate dimension is not 3', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      place: {
        type: GeometryTypes.MULTIPOLYHEDRON,
        coordinates: [[[[[[479816.67, 5705861.672]]]]]],
      },
    });

    expect(violations).toContainViolation('/req/polyhedra/coordinates');
  });

  test('Succeeds when a feature place has type "Polyhedron" with measures and the coordinate dimension is 4', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      measures: { enabled: true },
      place: {
        type: GeometryTypes.POLYHEDRON,
        coordinates: [[[[[479816.67, 5705861.672, 100, 100]]]]],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when a feature place has type "MultiPolyhedron" with measures and the coordinate dimension is 4', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      measures: { enabled: true },
      place: {
        type: GeometryTypes.MULTIPOLYHEDRON,
        coordinates: [[[[[[479816.67, 5705861.672, 100, 100]]]]]],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature place has type "Polyhedron" with measures and the coordinate dimension is not 4', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      measures: { enabled: true },
      place: {
        type: GeometryTypes.POLYHEDRON,
        coordinates: [[[[[479816.67, 5705861.672, 100]]]]],
      },
    });

    expect(violations).toContainViolation('/req/polyhedra/coordinates');
  });

  test('Fails when a feature place has type "MultiPolyhedron" with measures and the coordinate dimension is not 4', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      measures: { enabled: true },
      place: {
        type: GeometryTypes.MULTIPOLYHEDRON,
        coordinates: [[[[[[479816.67, 5705861.672, 100]]]]]],
      },
    });

    expect(violations).toContainViolation('/req/polyhedra/coordinates');
  });
});
