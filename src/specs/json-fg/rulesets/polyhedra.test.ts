import { Spectral } from '@stoplight/spectral-core';
import { reject } from 'ramda';
import { describe, expect, test } from 'vitest';
import featureCollectionDoc from '../examples/feature-collection.json';
import featureDoc from '../examples/feature.json';
import ruleset, { JSON_FG_POLYHEDRA_URI } from './polyhedra';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/polyhedra/metadata', () => {
  test('Fails when a feature has type "Polyhedron" and does not include the Polyhedra conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: reject(c => c === JSON_FG_POLYHEDRA_URI, featureDoc.conformsTo),
    });

    expect(violations).toContainViolation('/req/polyhedra/metadata');
  });

  test('Fails when a feature collection contains a feature of type "Polyhedron" and does not include the Polyhedra conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      conformsTo: reject(c => c === JSON_FG_POLYHEDRA_URI, featureDoc.conformsTo),
      features: [
        {
          ...featureCollectionDoc.features[0],
          place: {
            type: 'Polyhedron',
            coordinates: [],
          },
        },
      ],
    });

    expect(violations).toContainViolation('/req/polyhedra/metadata');
  });
});
