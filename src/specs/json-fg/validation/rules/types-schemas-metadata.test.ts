import { DocumentTypes, Feature, FeatureCollection, GeometryTypes } from '../../../../types';
import { applyRules } from '../ruleValidation';
import { CC_CORE_URI } from './core-metadata';
import metadata, { CC_TYPES_SCHEMAS_URI } from './types-schemas-metadata';

describe('Requirement 17A', () => {
  test('Fails when a feature contains a "featureType" member and does not include the Feature Types and Schemas conformance class', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE,
      conformsTo: [CC_CORE_URI],
      featureType: 'app:building',
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Fails when a feature collection contains a "featureType" member and does not include the Feature Types and Schemas conformance class', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI],
      featureType: 'app:building',
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });

  test('Fails when a feature collection member contains a "featureType" member and does not include the Feature Types and Schemas conformance class', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI],
      features: [
        {
          type: DocumentTypes.FEATURE,
          featureType: 'app:building',
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 18A', () => {
  test('Fails when a feature conforms to the Feature Types and Schemas conformance class and does not contain a "featureType" member', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE,
      conformsTo: [CC_CORE_URI, CC_TYPES_SCHEMAS_URI],
    } as Feature);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 18B', () => {
  test('Succeeds when a feature collection contains a "featureType" member', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI, CC_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      features: [
        {
          type: DocumentTypes.FEATURE,
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(0);
  });

  test('Succeeds when a feature collection contains a "featureType" member in every individual feature', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI, CC_TYPES_SCHEMAS_URI],
      features: [
        {
          type: DocumentTypes.FEATURE,
          featureType: 'app:building',
        },
        {
          type: DocumentTypes.FEATURE,
          featureType: 'app:building',
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(0);
  });

  test('Fails when both a feature collection and individual features contain a "featureType" member', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI, CC_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      features: [
        {
          type: DocumentTypes.FEATURE,
          featureType: 'app:building',
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });

  test('Fails when not every individual feature contains a "featureType" member', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI, CC_TYPES_SCHEMAS_URI],
      features: [
        {
          type: DocumentTypes.FEATURE,
          featureType: 'app:building',
        },
        {
          type: DocumentTypes.FEATURE,
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 19A', () => {
  test('Succeeds when a feature collection with "geometryDimension" 0 contains valid geometry types', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI, CC_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 0,
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.POINT,
          },
        },
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.MULTIPOINT,
          },
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(0);
  });

  test('Fails when a feature collection with "geometryDimension" 0 contains invalid geometry types', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI, CC_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 0,
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.POLYGON,
          },
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });

  test('Succeeds when a feature collection with "geometryDimension" 1 contains valid geometry types', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI, CC_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 1,
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.LINESTRING,
          },
        },
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.MULTILINESTRING,
          },
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(0);
  });

  test('Fails when a feature collection with "geometryDimension" 1 contains invalid geometry types', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI, CC_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 1,
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.POINT,
          },
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });

  test('Succeeds when a feature collection with "geometryDimension" 2 contains valid geometry types', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI, CC_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 2,
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.POLYGON,
          },
        },
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.MULTIPOLYGON,
          },
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(0);
  });

  test('Fails when a feature collection with "geometryDimension" 2 contains invalid geometry types', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI, CC_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 2,
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.POINT,
          },
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });

  test('Succeeds when a feature collection with "geometryDimension" 3 contains valid geometry types', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI, CC_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 3,
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.POLYHEDRON,
          },
        },
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.MULTIPOLYHEDRON,
          },
        },
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.PRISM,
          },
        },
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.MULTIPRISM,
          },
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(0);
  });

  test('Fails when a feature collection with "geometryDimension" 3 contains invalid geometry types', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI, CC_TYPES_SCHEMAS_URI],
      featureType: 'app:building',
      geometryDimension: 3,
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.POINT,
          },
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });
});
