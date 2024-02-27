import { DocumentTypes, Feature, GeometryTypes } from '../../types';
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
