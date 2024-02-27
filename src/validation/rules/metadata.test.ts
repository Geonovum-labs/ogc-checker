import { DocumentTypes, Feature, FeatureCollection } from '../../types';
import { applyRules } from '../ruleValidation';
import metadata from './metadata';

describe('Requirement 2A', () => {
  test('Fails when the "conformsTo" member of a feature is absent', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE,
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Fails when the "conformsTo" member of a feature collection is absent', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE_COLLECTION,
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });

  test('Succeeds when the "conformsTo" member of a feature contains the core URI', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE,
      conformsTo: ['http://www.opengis.net/spec/json-fg-1/0.2/conf/core'],
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Succeeds when the "conformsTo" member of a feature contains the core CURIE', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE,
      conformsTo: ['[ogc-json-fg-1-0.2:core]'],
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Succeeds when the "conformsTo" member of a feature collection contains the core URI', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE_COLLECTION,
      conformsTo: ['http://www.opengis.net/spec/json-fg-1/0.2/conf/core'],
    } as FeatureCollection);

    expect(violations.length).toBe(0);
  });

  test('Succeeds when the "conformsTo" member of a feature collection contains the core CURIE', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE_COLLECTION,
      conformsTo: ['[ogc-json-fg-1-0.2:core]'],
    } as FeatureCollection);

    expect(violations.length).toBe(0);
  });

  test('Fails when the "conformsTo" member of a feature does not contain the core URI/CURIE', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE,
      conformsTo: ['http://www.opengis.net/spec/json-fg-1/0.2/conf/3d'],
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Fails when the "conformsTo" member of a feature collection does not contain the core URI/CURIE', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE_COLLECTION,
      conformsTo: ['http://www.opengis.net/spec/json-fg-1/0.2/conf/3d'],
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });

  test('Fails when a member feature of a feature collection contains a "conformsTo" member', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE_COLLECTION,
      conformsTo: ['http://www.opengis.net/spec/json-fg-1/0.2/conf/core'],
      features: [
        {
          type: DocumentTypes.FEATURE,
          conformsTo: ['http://www.opengis.net/spec/json-fg-1/0.2/conf/core'],
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });
});
