import { Spectral } from '@stoplight/spectral-core';
import { reject } from 'ramda';
import { describe, expect, test } from 'vitest';
import featureCollectionDoc from '../examples/feature-collection.json';
import featureDoc from '../examples/feature.json';
import ruleset, { JSON_FG_MEASURES_URI } from './measures';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

describe('/req/measures/metadata', () => {
  test('Succeeds when a feature does not contain a "measures" member and does not include the Measures conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: reject(c => c === JSON_FG_MEASURES_URI, featureDoc.conformsTo),
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when a feature collection does not contain a "measures" member and does not include the Measures conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      conformsTo: reject(c => c === JSON_FG_MEASURES_URI, featureDoc.conformsTo),
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when a feature contains a "measures" member and does not include the Measures conformance class', async () => {
    const violations = await spectral.run({
      ...featureDoc,
      conformsTo: reject(c => c === JSON_FG_MEASURES_URI, featureDoc.conformsTo),
      measures: {
        enabled: true,
      },
    });

    expect(violations).toContainViolation('/req/measures/metadata');
  });

  test('Fails when a feature collection contains a "measures" member and does not include the Measures conformance class', async () => {
    const violations = await spectral.run({
      ...featureCollectionDoc,
      conformsTo: reject(c => c === JSON_FG_MEASURES_URI, featureDoc.conformsTo),
      measures: {
        enabled: true,
      },
    });

    expect(violations).toContainViolation('/req/measures/metadata');
  });
});
