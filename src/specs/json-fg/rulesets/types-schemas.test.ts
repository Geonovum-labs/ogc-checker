import { Spectral } from '@stoplight/spectral-core';
import { omit, reject } from 'ramda';
import { describe, expect, test } from 'vitest';
import featureCollectionDoc from '../examples/feature-collection.json';
import featureDoc from '../examples/feature.json';
import ruleset, { JSON_FG_TYPES_SCHEMAS_URI } from './types-schemas';
import { GeometryTypes } from '../../types';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/types-schemas/metadata', () => {
  test('Fails when a feature contains a "featureType" member and does not include the Feature Types and Schemas conformance class', async () => {
    const violations = await spectral.run({
      ...omit(['featureSchema'], featureDoc),
      conformsTo: reject(c => c === JSON_FG_TYPES_SCHEMAS_URI, featureDoc.conformsTo),
    });

    expect(violations).toContainViolation('/req/types-schemas/metadata');
  });

  test('Fails when a feature contains a "featureSchema" member and does not include the Feature Types and Schemas conformance class', async () => {
    const violations = await spectral.run({
      ...omit(['featureType'], featureDoc),
      conformsTo: reject(c => c === JSON_FG_TYPES_SCHEMAS_URI, featureDoc.conformsTo),
    });

    expect(violations).toContainViolation('/req/types-schemas/metadata');
  });

  test('Fails when a feature collection contains a "featureType" member and does not include the Feature Types and Schemas conformance class', async () => {
    const violations = await spectral.run({
      ...omit(['featureSchema'], featureCollectionDoc),
      conformsTo: reject(c => c === JSON_FG_TYPES_SCHEMAS_URI, featureDoc.conformsTo),
    });

    expect(violations).toContainViolation('/req/types-schemas/metadata');
  });

  test('Fails when a feature collection contains a "featureSchema" member and does not include the Feature Types and Schemas conformance class', async () => {
    const violations = await spectral.run({
      ...omit(['featureType'], featureCollectionDoc),
      conformsTo: reject(c => c === JSON_FG_TYPES_SCHEMAS_URI, featureDoc.conformsTo),
    });

    expect(violations).toContainViolation('/req/types-schemas/metadata');
  });

  test('Fails when a feature collection member contains a "featureType" member and does not include the Feature Types and Schemas conformance class', async () => {
    const violations = await spectral.run({
      ...omit(['featureType', 'featureSchema'], featureCollectionDoc),
      conformsTo: reject(c => c === JSON_FG_TYPES_SCHEMAS_URI, featureDoc.conformsTo),
      features: [
        {
          ...featureCollectionDoc.features[0],
          featureType: featureCollectionDoc.featureType,
        },
      ],
    });

    expect(violations).toContainViolation('/req/types-schemas/metadata');
  });

  test('Fails when a feature collection member contains a "featureSchema" member and does not include the Feature Types and Schemas conformance class', async () => {
    const violations = await spectral.run({
      ...omit(['featureType', 'featureSchema'], featureCollectionDoc),
      conformsTo: reject(c => c === JSON_FG_TYPES_SCHEMAS_URI, featureDoc.conformsTo),
      features: [
        {
          ...featureCollectionDoc.features[0],
          featureSchema: featureCollectionDoc.featureSchema,
        },
      ],
    });

    expect(violations).toContainViolation('/req/types-schemas/metadata');
  });
});

describe('/req/types-schemas/feature-type', () => {
  test('Fails when a feature conforms to the Feature Types and Schemas conformance class and does not contain a "featureType" member', async () => {
    const violations = await spectral.run({
      ...omit(['featureType', 'featureSchema'], featureDoc),
    });

    expect(violations).toContainViolation('/req/types-schemas/feature-type');
  });

  test('Succeeds when a feature collection contains a "featureType" member', async () => {
    const violations = await spectral.run({
      ...omit(['featureSchema'], featureCollectionDoc),
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when a feature collection contains a "featureType" member in every individual feature', async () => {
    const violations = await spectral.run({
      ...omit(['featureType', 'featureSchema'], featureCollectionDoc),
      features: [
        {
          ...featureCollectionDoc.features[0],
          featureType: 'Building',
        },
        {
          ...featureCollectionDoc.features[1],
          featureType: 'Building',
        },
      ],
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when both a feature collection and individual features contain a "featureType" member', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      features: [
        {
          ...featureCollectionDoc.features[0],
          featureType: 'Building',
        },
      ],
    });

    expect(violations).toContainViolation('/req/types-schemas/feature-type');
  });

  test('Fails when not every individual feature contains a "featureType" member', async () => {
    const violations = await spectral.run({
      ...omit(['featureType', 'featureSchema'], featureCollectionDoc),
      features: [
        {
          ...featureCollectionDoc.features[0],
          featureType: 'Building',
        },
        {
          ...featureCollectionDoc.features[1],
        },
      ],
    });

    expect(violations).toContainViolation('/req/types-schemas/feature-type', 3);
  });
});

describe('/req/types-schemas/geometry-dimension', () => {
  test('Succeeds when a feature collection with "geometryDimension" 0 contains valid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      geometryDimension: 0,
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.POINT,
            coordinates: [],
          },
        },
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.MULTIPOINT,
            coordinates: [],
          },
        },
      ],
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature collection with "geometryDimension" 0 contains invalid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      geometryDimension: 0,
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.POLYGON,
            coordinates: [],
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/types-schemas/geometry-dimension');
  });

  test('Succeeds when a feature collection with "geometryDimension" 1 contains valid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      geometryDimension: 1,
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.LINESTRING,
            coordinates: [],
          },
        },
        {
          ...featureCollectionDoc.features[1],
          place: {
            type: GeometryTypes.CIRCULARSTRING,
            coordinates: [],
          },
        },
        {
          ...featureCollectionDoc.features[1],
          place: {
            type: GeometryTypes.COMPOUNDCURVE,
            coordinates: [],
          },
        },
        {
          ...featureCollectionDoc.features[1],
          place: {
            type: GeometryTypes.MULTICURVE,
            coordinates: [],
          },
        },
      ],
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature collection with "geometryDimension" 1 contains invalid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      geometryDimension: 1,
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.POINT,
            coordinates: [],
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/types-schemas/geometry-dimension');
  });

  test('Succeeds when a feature collection with "geometryDimension" 2 contains valid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      geometryDimension: 2,
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.POLYGON,
            coordinates: [],
          },
        },
        {
          ...featureCollectionDoc.features[1],
          place: {
            type: GeometryTypes.MULTIPOLYGON,
            coordinates: [],
          },
        },
      ],
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature collection with "geometryDimension" 2 contains invalid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      geometryDimension: 2,
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.POINT,
            coordinates: [],
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/types-schemas/geometry-dimension');
  });

  test('Succeeds when a feature collection with "geometryDimension" 3 contains valid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      geometryDimension: 3,
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.POLYHEDRON,
            coordinates: [],
          },
        },
        {
          ...featureCollectionDoc.features[1],
          place: {
            type: GeometryTypes.MULTIPOLYHEDRON,
            coordinates: [],
          },
        },
        {
          ...featureCollectionDoc.features[2],
          place: {
            type: GeometryTypes.PRISM,
            coordinates: [],
          },
        },
        {
          ...featureCollectionDoc.features[3],
          place: {
            type: GeometryTypes.MULTIPRISM,
            coordinates: [],
          },
        },
      ],
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature collection with "geometryDimension" 3 contains invalid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      geometryDimension: 3,
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: GeometryTypes.POINT,
            coordinates: [],
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/types-schemas/geometry-dimension');
  });
});