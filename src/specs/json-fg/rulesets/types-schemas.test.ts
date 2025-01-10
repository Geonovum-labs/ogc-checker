import { Spectral } from '@stoplight/spectral-core';
import { describe, expect, test } from 'vitest';
import { DocumentTypes, GeometryTypes } from '../../../types';
import { JSON_FG_CORE_URI } from './core';
import ruleset, { JSON_FG_TYPES_SCHEMAS_URI } from './types-schemas';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

const feature = {
  type: DocumentTypes.FEATURE,
  time: null,
  place: null,
  geometry: null,
  properties: null,
};

const featureCollection = {
  type: DocumentTypes.FEATURECOLLECTION,
  features: [feature],
};

describe('/req/types-schemas/metadata', () => {
  test('Fails when a feature contains a "featureType" member and does not include the Feature Types and Schemas conformance class', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [JSON_FG_CORE_URI],
      featureType: 'app:building',
    });

    expect(violations).toContainViolation('/req/types-schemas/metadata');
  });

  test('Fails when a feature collection contains a "featureType" member and does not include the Feature Types and Schemas conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI],
      featureType: 'app:building',
    });

    expect(violations).toContainViolation('/req/types-schemas/metadata');
  });

  test('Fails when a feature collection member contains a "featureType" member and does not include the Feature Types and Schemas conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI],
      features: [
        {
          ...feature,
          featureType: 'app:building',
        },
      ],
    });

    expect(violations).toContainViolation('/req/types-schemas/metadata');
  });
});

describe('/req/types-schemas/feature-type', () => {
  test('Fails when a feature conforms to the Feature Types and Schemas conformance class and does not contain a "featureType" member', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_TYPES_SCHEMAS_URI],
    });

    expect(violations).toContainViolation('/req/types-schemas/feature-type');
  });

  test('Succeeds when a feature collection contains a "featureType" member', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      features: [
        {
          ...feature,
        },
      ],
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when a feature collection contains a "featureType" member in every individual feature', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_TYPES_SCHEMAS_URI],
      features: [
        {
          ...feature,
          featureType: 'app:building',
        },
        {
          ...feature,
          featureType: 'app:building',
        },
      ],
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when both a feature collection and individual features contain a "featureType" member', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      features: [
        {
          ...feature,
          featureType: 'app:building',
        },
      ],
    });

    expect(violations).toContainViolation('/req/types-schemas/feature-type');
  });

  test('Fails when not every individual feature contains a "featureType" member', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_TYPES_SCHEMAS_URI],
      features: [
        {
          ...feature,
          featureType: 'app:building',
        },
        {
          ...feature,
        },
      ],
    });

    expect(violations).toContainViolation('/req/types-schemas/feature-type');
  });
});

describe('/req/types-schemas/geometry-dimension', () => {
  test('Succeeds when a feature collection with "geometryDimension" 0 contains valid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 0,
      features: [
        {
          ...feature,
          place: {
            type: GeometryTypes.POINT,
          },
        },
        {
          ...feature,
          place: {
            type: GeometryTypes.MULTIPOINT,
          },
        },
      ],
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature collection with "geometryDimension" 0 contains invalid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 0,
      features: [
        {
          ...feature,
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
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 1,
      features: [
        {
          ...feature,
          place: {
            type: GeometryTypes.LINESTRING,
          },
        },
        {
          ...feature,
          place: {
            type: GeometryTypes.MULTILINESTRING,
          },
        },
      ],
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature collection with "geometryDimension" 1 contains invalid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 1,
      features: [
        {
          ...feature,
          place: {
            type: GeometryTypes.POINT,
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/types-schemas/geometry-dimension');
  });

  test('Succeeds when a feature collection with "geometryDimension" 2 contains valid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 2,
      features: [
        {
          ...feature,
          place: {
            type: GeometryTypes.POLYGON,
          },
        },
        {
          ...feature,
          place: {
            type: GeometryTypes.MULTIPOLYGON,
          },
        },
      ],
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature collection with "geometryDimension" 2 contains invalid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 2,
      features: [
        {
          ...feature,
          place: {
            type: GeometryTypes.POINT,
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/types-schemas/geometry-dimension');
  });

  test('Succeeds when a feature collection with "geometryDimension" 3 contains valid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 3,
      features: [
        {
          ...feature,
          place: {
            type: GeometryTypes.POLYHEDRON,
          },
        },
        {
          ...feature,
          place: {
            type: GeometryTypes.MULTIPOLYHEDRON,
          },
        },
        {
          ...feature,
          place: {
            type: GeometryTypes.PRISM,
          },
        },
        {
          ...feature,
          place: {
            type: GeometryTypes.MULTIPRISM,
          },
        },
      ],
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature collection with "geometryDimension" 3 contains invalid geometry types', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 3,
      features: [
        {
          ...feature,
          place: {
            type: GeometryTypes.POINT,
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/types-schemas/geometry-dimension');
  });
});
