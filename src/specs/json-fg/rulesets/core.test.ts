import { Spectral } from '@stoplight/spectral-core';
import { describe, expect, test } from 'vitest';
import { DocumentTypes, GeometryTypes } from '../../../types';
import { CC_3D_URI } from './3d';
import ruleset, { CC_CORE_CURIE, CC_CORE_URI } from './core';

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

describe('/req/core/interval', () => {
  test('Fails when start instant is date and end instant is timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        interval: ['2024-02-28', '2024-02-29T10:00:00Z'],
      },
    });

    expect(violations).toContainViolation('/req/core/interval#B');
  });

  test('Fails when start instant is timestamp and end instant is date', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        interval: ['2024-02-28T10:00:00Z', '2024-02-29'],
      },
    });

    expect(violations).toContainViolation('/req/core/interval#C');
  });
});

describe('/req/core/instant-and-interval', () => {
  test('Succeeds when date does match "full-date" part of the timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-28',
        timestamp: '2024-02-28T10:00:00Z',
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when date does not match "full-date" part of the timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-27',
        timestamp: '2024-02-28T10:00:00Z',
      },
    });

    expect(violations).toContainViolation('/req/core/instant-and-interval#A');
  });

  test('Succeeds when date interval contains timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        timestamp: '2024-02-28T10:00:00Z',
        interval: ['2024-02-28', '2024-02-29'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when zero-length date interval matches "full-date" part of timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        timestamp: '2024-02-28T10:00:00Z',
        interval: ['2024-02-28', '2024-02-28'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when date interval does not contain timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        timestamp: '2024-02-27T10:00:00Z',
        interval: ['2024-02-28', '2024-02-29'],
      },
    });

    expect(violations).toContainViolation('/req/core/instant-and-interval#B');
  });

  test('Succeeds when timestamp interval contains timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        timestamp: '2024-02-28T10:00:00Z',
        interval: ['2024-02-28T09:00:00Z', '2024-02-28T11:00:00Z'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when zero-length timestamp interval equals the timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        timestamp: '2024-02-28T10:00:00Z',
        interval: ['2024-02-28T10:00:00Z', '2024-02-28T10:00:00Z'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when timestamp interval does not contain timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        timestamp: '2024-02-28T08:00:00Z',
        interval: ['2024-02-28T09:00:00Z', '2024-02-28T11:00:00Z'],
      },
    });

    expect(violations).toContainViolation('/req/core/instant-and-interval#C');
  });

  test('Succeeds when date interval contains date', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-28',
        interval: ['2024-02-28', '2024-02-29'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when zero-length date interval equals the date', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-28',
        interval: ['2024-02-28', '2024-02-28'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when date interval does not contain date', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-27',
        interval: ['2024-02-28', '2024-02-28'],
      },
    });

    expect(violations).toContainViolation('/req/core/instant-and-interval#D');
  });

  test('Succeeds when timestamp interval includes timestamps on the date', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-28',
        interval: ['2024-02-28T09:00:00Z', '2024-02-29T11:00:00Z'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when "full-date" part of zero-length timestamp interval equals the date', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-28',
        interval: ['2024-02-28T09:00:00Z', '2024-02-28T09:00:00Z'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when timestamp interval does not include timestamps on the date', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-28',
        interval: ['2024-02-29T09:00:00Z', '2024-02-29T11:00:00Z'],
      },
    });

    expect(violations).toContainViolation('/req/core/instant-and-interval#E');
  });
});

describe('/req/core/coordinate-dimension', () => {
  test('Succeeds when all coordinates of the "geometry" member have the same dimension', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      geometry: {
        type: GeometryTypes.MULTIPOINT,
        coordinates: [
          [10, 20],
          [20, 30],
        ],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when some coordinates of the "geometry" member have different dimensions', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      geometry: {
        type: GeometryTypes.MULTIPOINT,
        coordinates: [
          [10, 20],
          [20, 30, 40],
        ],
      },
    });

    expect(violations).toContainViolation('/req/core/coordinate-dimension');
  });

  test('Succeeds when all coordinates of the "place" member have the same dimension', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      place: {
        type: GeometryTypes.PRISM,
        base: {
          type: GeometryTypes.MULTIPOINT,
          coordinates: [
            [10, 20],
            [20, 30],
          ],
        },
        upper: 10,
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when some coordinates of the "place" member have different dimensions', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      place: {
        type: GeometryTypes.MULTIPOINT,
        coordRefSys: 'http://www.opengis.net/def/crs/EPSG/0/27700',
        coordinates: [
          [10, 20],
          [20, 30, 40],
        ],
      },
    });

    expect(violations).toContainViolation('/req/core/coordinate-dimension');
  });

  test('Fails when some coordinates of the "place" member being a Prism have different dimensions', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      place: {
        type: GeometryTypes.PRISM,
        base: {
          type: GeometryTypes.MULTIPOINT,
          coordinates: [
            [10, 20],
            [20, 30, 40],
          ],
        },
        upper: 10,
      },
    });

    expect(violations).toContainViolation('/req/core/coordinate-dimension');
  });

  test('Fails when some coordinates of the "place" member being a MultiPrism have different dimensions', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      place: {
        type: GeometryTypes.MULTIPRISM,
        prisms: [
          {
            type: GeometryTypes.PRISM,
            base: {
              type: GeometryTypes.MULTIPOINT,
              coordinates: [
                [10, 20],
                [20, 30, 40],
              ],
            },
            upper: 10,
          },
        ],
      },
    });

    expect(violations).toContainViolation('/req/core/coordinate-dimension');
  });
});

describe('/req/core/geometry-wgs84', () => {
  test('Fails when some first elements have a value out of bounds.', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      geometry: {
        type: GeometryTypes.MULTIPOINT,
        coordinates: [
          [-181, 20],
          [20, 30],
        ],
      },
    });

    expect(violations).toContainViolation('/req/core/geometry-wgs84');
  });

  test('Fails when some first elements have a value out of bounds.', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      geometry: {
        type: GeometryTypes.MULTIPOINT,
        coordinates: [
          [10, -91],
          [20, 30],
        ],
      },
    });

    expect(violations).toContainViolation('/req/core/geometry-wgs84');
  });
});

describe('/req/core/place', () => {
  test('Fails when a GeoJSON type and no coordRefSys is given.', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      place: {
        type: GeometryTypes.POINT,
        coordinates: [10, 10],
      },
    });

    expect(violations).toContainViolation('/req/core/place');
  });

  test('Fails when a GeoJSON type and a CRS84 coordRefSys is given on the geometry level.', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      place: {
        type: GeometryTypes.POINT,
        coordRefSys: '[OGC:CRS84]',
        coordinates: [10, 10],
      },
    });

    expect(violations).toContainViolation('/req/core/place');
  });

  test('Fails when a GeoJSON type and a CRS84 coordRefSys is given on the feature level.', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      coordRefSys: '[OGC:CRS84]',
      place: {
        type: GeometryTypes.POINT,
        coordinates: [10, 10],
      },
    });

    expect(violations).toContainViolation('/req/core/place');
  });

  test('Succeeds when a GeoJSON type and a non-CRS84 coordRefSys is given on the feature collection level.', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [CC_CORE_URI],
      coordRefSys: 'http://www.opengis.net/def/crs/EPSG/0/27700',
      features: [
        {
          ...feature,
          place: {
            type: GeometryTypes.POINT,
            coordinates: [10, 10],
          },
        },
      ],
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a GeoJSON type and a CRS84 coordRefSys is given on the feature collection level.', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [CC_CORE_URI],
      coordRefSys: '[OGC:CRS84]',
      features: [
        {
          ...feature,
          place: {
            type: GeometryTypes.POINT,
            coordinates: [10, 10],
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/core/place');
  });

  test('Fails when a GeoJSON type and a CRS84 coordRefSys by ref is given on the geometry level.', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      place: {
        type: GeometryTypes.POINT,
        coordRefSys: {
          type: 'Reference',
          href: '[OGC:CRS84]',
        },
        coordinates: [10, 10],
      },
    });

    expect(violations).toContainViolation('/req/core/place');
  });
});

describe('/req/core/geometry-collection', () => {
  test('Fails when a GeometryCollection member contains a "coordRefSys" member.', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      place: {
        type: GeometryTypes.GEOMETRYCOLLECTION,
        coordRefSys: 'http://www.opengis.net/def/crs/EPSG/0/27700',
        geometries: [
          {
            type: GeometryTypes.POINT,
            coordRefSys: 'http://www.opengis.net/def/crs/EPSG/0/27700',
            coordinates: [10, 20],
          },
        ],
      },
    });

    // TODO: Change back once schema issue is fixed: https://github.com/opengeospatial/ogc-feat-geo-json/issues/134
    // expect(violations).toContainViolation('/req/core/place');
    expect(violations.length).toBe(7);
  });

  test('Fails when a Prism base contains a "coordRefSys" member.', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      place: {
        type: GeometryTypes.PRISM,
        coordRefSys: 'http://www.opengis.net/def/crs/EPSG/0/27700',
        base: {
          type: GeometryTypes.POINT,
          coordRefSys: 'http://www.opengis.net/def/crs/EPSG/0/27700',
          coordinates: [10, 20],
        },
        upper: 10,
      },
    });

    expect(violations).toContainViolation('/req/core/geometry-collection');
  });

  test('Fails when a PrismCollection member contains a "coordRefSys" member.', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      place: {
        type: GeometryTypes.MULTIPRISM,
        coordRefSys: 'http://www.opengis.net/def/crs/EPSG/0/27700',
        prisms: [
          {
            type: GeometryTypes.PRISM,
            coordRefSys: 'http://www.opengis.net/def/crs/EPSG/0/27700',
            base: {
              type: GeometryTypes.POINT,
              coordinates: [10, 20],
            },
            upper: 10,
          },
        ],
      },
    });

    expect(violations).toContainViolation('/req/core/geometry-collection');
  });

  test('Fails when a PrismCollection member base contains a "coordRefSys" member.', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      place: {
        type: GeometryTypes.MULTIPRISM,
        coordRefSys: 'http://www.opengis.net/def/crs/EPSG/0/27700',
        prisms: [
          {
            type: GeometryTypes.PRISM,
            base: {
              type: GeometryTypes.POINT,
              coordRefSys: 'http://www.opengis.net/def/crs/EPSG/0/27700',
              coordinates: [10, 20],
            },
            upper: 10,
          },
        ],
      },
    });

    expect(violations).toContainViolation('/req/core/geometry-collection');
  });
});

describe('/req/core/fallback', () => {
  test('Fails when the values for the "place" and "geometry" members are equal.', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      place: {
        type: GeometryTypes.POINT,
        coordRefSys: 'http://www.opengis.net/def/crs/EPSG/0/27700',
        coordinates: [10, 20],
      },
      geometry: {
        type: GeometryTypes.POINT,
        coordRefSys: 'http://www.opengis.net/def/crs/EPSG/0/27700',
        coordinates: [10, 20],
      },
    });

    expect(violations.length).toBe(1);
  });
});
