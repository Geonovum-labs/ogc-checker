import { DocumentTypes, Feature, FeatureCollection } from '../../types';
import { applyRules } from '../ruleValidation';
import metadata from './3d-metadata';
import { CC_CORE_URI } from './core-metadata';

describe('Requirement 14A', () => {
  test('Fails when a feature contains a 3D geometry and does not include the 3D conformance class', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE,
      conformsTo: [CC_CORE_URI],
      place: {
        type: 'Polyhedron',
      },
    } as Feature);

    expect(violations.length).toBe(1);
  });

  test('Fails when a feature collection contains a 3D geometry and does not include the 3D conformance class', () => {
    const violations = applyRules(metadata, {
      type: DocumentTypes.FEATURE_COLLECTION,
      conformsTo: [CC_CORE_URI],
      features: [
        {
          type: DocumentTypes.FEATURE,
          place: {
            type: 'Polyhedron',
          },
        },
      ],
    } as FeatureCollection);

    expect(violations.length).toBe(1);
  });
});
