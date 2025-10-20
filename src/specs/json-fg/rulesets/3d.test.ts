import { Spectral } from '@stoplight/spectral-core';
import { describe, expect, test } from 'vitest';
import ruleset, { JSON_FG_3D_URI } from './3d';
import { JSON_FG_CORE_URI } from './core';
import { DocumentTypes, GeometryTypes } from '@geonovum/standards-checker';

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

describe('/req/3d/metadata', () => {
  test('Succeeds when a feature does not contain a 3D geometry and does not include the 3D conformance class', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [JSON_FG_CORE_URI],
      place: {
        type: GeometryTypes.POLYGON,
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when a feature contains a 3D geometry and does include the 3D conformance class', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_3D_URI],
      place: {
        type: GeometryTypes.POLYHEDRON,
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature contains a 3D geometry and does not include the 3D conformance class', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [JSON_FG_CORE_URI],
      place: {
        type: GeometryTypes.POLYHEDRON,
      },
    });

    expect(violations).toContainViolation('/req/3d/metadata');
  });

  test('Succeeds when a feature collection does not contain a 3D geometry and does not include the 3D conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI],
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.POLYGON,
          },
        },
      ],
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when a feature collection contains a 3D geometry and does not include the 3D conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI, JSON_FG_3D_URI],
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.POLYHEDRON,
          },
        },
      ],
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature collection contains a 3D geometry and does not include the 3D conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [JSON_FG_CORE_URI],
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.POLYHEDRON,
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/3d/metadata');
  });
});
