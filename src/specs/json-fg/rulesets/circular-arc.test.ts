import { Spectral } from '@stoplight/spectral-core';
import { reject } from 'ramda';
import { describe, expect, test } from 'vitest';
import { GeometryTypes } from '../../../types';
import featureCollectionDoc from '../examples/feature-collection.json';
import featureDoc from '../examples/feature.json';
import ruleset, { JSON_FG_CIRCULAR_ARCS_URI } from './circular-arcs';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/circular-arcs/metadata', () => {
  test('Succeeds when a feature place does not have a circular arc type and does not include the Circular Arcs conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      place: {
        type: GeometryTypes.POINT,
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature place has type "CircularString" and does not include the Circular Arcs conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: reject(c => c === JSON_FG_CIRCULAR_ARCS_URI, featureDoc.conformsTo),
      place: {
        type: GeometryTypes.CIRCULARSTRING,
      },
    });

    expect(violations).toContainViolation('/req/circular-arcs/metadata');
  });

  test('Fails when a feature place has type "CompoundCurve" and does not include the Circular Arcs conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: reject(c => c === JSON_FG_CIRCULAR_ARCS_URI, featureDoc.conformsTo),
      place: {
        type: GeometryTypes.COMPOUNDCURVE,
      },
    });

    expect(violations).toContainViolation('/req/circular-arcs/metadata');
  });

  test('Fails when a feature place has type "CurvePolygon" and does not include the Circular Arcs conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: reject(c => c === JSON_FG_CIRCULAR_ARCS_URI, featureDoc.conformsTo),
      place: {
        type: GeometryTypes.CURVEPOLYGON,
      },
    });

    expect(violations).toContainViolation('/req/circular-arcs/metadata');
  });

  test('Fails when a feature place has type "MultiCurve" and does not include the Circular Arcs conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: reject(c => c === JSON_FG_CIRCULAR_ARCS_URI, featureDoc.conformsTo),
      place: {
        type: GeometryTypes.MULTICURVE,
      },
    });

    expect(violations).toContainViolation('/req/circular-arcs/metadata');
  });

  test('Fails when a feature place has type "MultiSurface" and does not include the Circular Arcs conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: reject(c => c === JSON_FG_CIRCULAR_ARCS_URI, featureDoc.conformsTo),
      place: {
        type: GeometryTypes.MULTISURFACE,
      },
    });

    expect(violations).toContainViolation('/req/circular-arcs/metadata');
  });

  test('Fails when a feature collection contains a feature of type "CircularString" and does not include the Circular Arcs conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      conformsTo: reject(c => c === JSON_FG_CIRCULAR_ARCS_URI, featureDoc.conformsTo),
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.CIRCULARSTRING,
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/circular-arcs/metadata');
  });

  test('Fails when a feature collection contains a feature of type "CompoundCurve" and does not include the Circular Arcs conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      conformsTo: reject(c => c === JSON_FG_CIRCULAR_ARCS_URI, featureDoc.conformsTo),
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.COMPOUNDCURVE,
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/circular-arcs/metadata');
  });

  test('Fails when a feature collection contains a feature of type "CurvePolygon" and does not include the Circular Arcs conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      conformsTo: reject(c => c === JSON_FG_CIRCULAR_ARCS_URI, featureDoc.conformsTo),
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.CURVEPOLYGON,
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/circular-arcs/metadata');
  });

  test('Fails when a feature collection contains a feature of type "MultiCurve" and does not include the Circular Arcs conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      conformsTo: reject(c => c === JSON_FG_CIRCULAR_ARCS_URI, featureDoc.conformsTo),
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.MULTICURVE,
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/circular-arcs/metadata');
  });

  test('Fails when a feature collection contains a feature of type "MultiSurface" and does not include the Circular Arcs conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      conformsTo: reject(c => c === JSON_FG_CIRCULAR_ARCS_URI, featureDoc.conformsTo),
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.MULTISURFACE,
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/circular-arcs/metadata');
  });
});
