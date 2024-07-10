import { DocumentTypes, Feature, FeatureCollection, GeometryTypes } from '../../../../types';
import { applyRules } from '../ruleValidation';
import metadata from './3d-metadata';
import { CC_CORE_URI } from './core-metadata';

describe('Requirement 14A', () => {
  test('Succeeds when a feature does not contain a 3D geometry and does not include the 3D conformance class', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE,
      conformsTo: [CC_CORE_URI],
      place: {
        type: GeometryTypes.POLYGON,
      },
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Fails when a feature contains a 3D geometry and does not include the 3D conformance class', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE,
      conformsTo: [CC_CORE_URI],
      place: {
        type: GeometryTypes.POLYHEDRON,
      },
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Succeeds when a feature collection does not contain a 3D geometry and does not include the 3D conformance class', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI],
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.POLYGON,
          },
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(0);
  });

  test('Fails when a feature collection contains a 3D geometry and does not include the 3D conformance class', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURECOLLECTION,
      conformsTo: [CC_CORE_URI],
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: GeometryTypes.POLYHEDRON,
          },
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });
});
