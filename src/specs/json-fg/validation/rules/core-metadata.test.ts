import { DocumentTypes, Feature, FeatureCollection } from '../../../../types';
import { applyRules } from '../ruleValidation';
import { CC_3D_URI } from './3d-metadata';
import metadata, { CC_CORE_CURIE, CC_CORE_URI } from './core-metadata';

describe('Requirement 2A', () => {
  test('Fails when the "conformsTo" member of a feature is absent', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE,
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Fails when the "conformsTo" member of a feature collection is absent', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });

  test('Succeeds when the "conformsTo" member of a feature contains the core URI', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE,
      conformsTo: [CC_CORE_URI],
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Succeeds when the "conformsTo" member of a feature contains the core CURIE', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE,
      conformsTo: [CC_CORE_CURIE],
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Succeeds when the "conformsTo" member of a feature collection contains the core URI', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI],
    } as FeatureCollection);

    expect(violations.length).toBe(0);
  });

  test('Succeeds when the "conformsTo" member of a feature collection contains the core CURIE', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_CURIE],
    } as FeatureCollection);

    expect(violations.length).toBe(0);
  });

  test('Fails when the "conformsTo" member of a feature does not contain the core URI/CURIE', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE,
      conformsTo: [CC_3D_URI],
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Fails when the "conformsTo" member of a feature collection does not contain the core URI/CURIE', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_3D_URI],
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });

  test('Fails when a member feature of a feature collection contains a "conformsTo" member', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI],
      features: [
        {
          type: DocumentTypes.FEATURE,
          conformsTo: [CC_CORE_URI],
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });
});
