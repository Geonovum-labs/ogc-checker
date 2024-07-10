import { DocumentTypes, Feature, FeatureCollection, GeometryTypes } from '../../../../types';
import { applyRules } from '../ruleValidation';
import geometry from './core-geometry';

describe('Requirement 7A', () => {
  test('Succeeds when all coordinates of the "geometry" member have the same dimension', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
      place: null,
      geometry: {
        type: GeometryTypes.MULTIPOINT,
        coordinates: [
          [10, 20],
          [20, 30],
        ],
      },
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Fails when some coordinates of the "geometry" member have different dimensions', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
      place: null,
      geometry: {
        type: GeometryTypes.MULTIPOINT,
        coordinates: [
          [10, 20],
          [20, 30, 40],
        ],
      },
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Succeeds when all coordinates of the "place" member have the same dimension', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
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
      geometry: null,
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Fails when some coordinates of the "place" member have different dimensions', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
      place: {
        type: GeometryTypes.MULTIPOINT,
        coordRefSys: 'http://www.opengis.net/def/crs/EPSG/0/27700',
        coordinates: [
          [10, 20],
          [20, 30, 40],
        ],
      },
      geometry: null,
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Fails when some coordinates of the "place" member being a Prism have different dimensions', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
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
      geometry: null,
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Fails when some coordinates of the "place" member being a MultiPrism have different dimensions', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
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
      geometry: null,
    } as Feature);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 8A', () => {
  test('Fails when some first elements have a value out of bounds.', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
      place: null,
      geometry: {
        type: GeometryTypes.MULTIPOINT,
        coordinates: [
          [-181, 20],
          [20, 30],
        ],
      },
    } as Feature);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 8B', () => {
  test('Fails when some first elements have a value out of bounds.', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
      place: null,
      geometry: {
        type: GeometryTypes.MULTIPOINT,
        coordinates: [
          [10, -91],
          [20, 30],
        ],
      },
    } as Feature);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 10A', () => {
  test('Fails when a GeoJSON type and no coordRefSys is given.', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
      place: {
        type: GeometryTypes.POINT,
        coordinates: [10, 10],
      },
      geometry: null,
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Fails when a GeoJSON type and a CRS84 coordRefSys is given on the geometry level.', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
      place: {
        type: GeometryTypes.POINT,
        coordRefSys: '[OGC:CRS84]',
        coordinates: [10, 10],
      },
      geometry: null,
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Fails when a GeoJSON type and a CRS84 coordRefSys is given on the feature level.', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
      coordRefSys: '[OGC:CRS84]',
      place: {
        type: GeometryTypes.POINT,
        coordinates: [10, 10],
      },
      geometry: null,
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Succeeds when a GeoJSON type and a non-CRS84 coordRefSys is given on the feature collection level.', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURECOLLECTION,
      coordRefSys: 'http://www.opengis.net/def/crs/EPSG/0/27700',
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.POINT,
            coordinates: [10, 10],
          },
          geometry: null,
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(0);
  });

  test('Fails when a GeoJSON type and a CRS84 coordRefSys is given on the feature collection level.', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURECOLLECTION,
      coordRefSys: '[OGC:CRS84]',
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.POINT,
            coordinates: [10, 10],
          },
          geometry: null,
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });

  test('Fails when a GeoJSON type and a CRS84 coordRefSys by ref is given on the geometry level.', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
      place: {
        type: GeometryTypes.POINT,
        coordRefSys: {
          type: 'Reference',
          href: '[OGC:CRS84]',
        },
        coordinates: [10, 10],
      },
      geometry: null,
    } as Feature);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 11A', () => {
  test('Fails when a GeometryCollection member contains a "coordRefSys" member.', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
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
      geometry: null,
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Fails when a Prism base contains a "coordRefSys" member.', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
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
      geometry: null,
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Fails when a PrismCollection member contains a "coordRefSys" member.', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
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
      geometry: null,
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Fails when a PrismCollection member base contains a "coordRefSys" member.', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
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
      geometry: null,
    } as Feature);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 12A', () => {
  test('Fails when the values for the "place" and "geometry" members are equal.', () => {
    const violations = applyRules(geometry, {
      type: DocumentTypes.FEATURE,
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
    } as Feature);

    expect(violations.length).toBe(1);
  });
});
