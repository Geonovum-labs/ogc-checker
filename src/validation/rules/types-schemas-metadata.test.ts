import { DocumentTypes, Feature, FeatureCollection } from '../../types';
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
      type: DocumentTypes.FEATURE_COLLECTION,
      conformsTo: [CC_CORE_URI],
      featureType: 'app:building',
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });

  test('Fails when a feature collection member contains a "featureType" member and does not include the Feature Types and Schemas conformance class', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE_COLLECTION,
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
      type: DocumentTypes.FEATURE_COLLECTION,
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
      type: DocumentTypes.FEATURE_COLLECTION,
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
      type: DocumentTypes.FEATURE_COLLECTION,
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
      type: DocumentTypes.FEATURE_COLLECTION,
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
