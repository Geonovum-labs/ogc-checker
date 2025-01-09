import { Spectral } from '@stoplight/spectral-core';
import { describe, expect, test } from 'vitest';
import { CC_3D_URI } from './3d';
import ruleset, { CC_CORE_CURIE, CC_CORE_URI } from './core';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

const feature = {
  type: 'Feature',
  time: null,
  place: null,
  geometry: null,
  properties: null,
};

const featureCollection = {
  type: 'FeatureCollection',
  features: [feature],
};

describe('/req/core/schema-valid', () => {
  test('Fails when required properties are absent on feature', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      place: undefined,
    });

    expect(violations).toContainViolation('/req/core/schema-valid', /Object must have required property "place"\.$/);
  });

  test('Fails when required properties are absent on feature collection', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [CC_CORE_URI],
      features: undefined,
    });

    expect(violations).toContainViolation('/req/core/schema-valid', /Object must have required property "features"\.$/);
  });
});

describe('/req/core/metadata', () => {
  test('Fails when the "conformsTo" member of a feature is absent', async () => {
    const violations = await spectral.run({
      ...feature,
    });

    expect(violations).toContainViolation('/req/core/metadata#A');
  });

  test('Fails when the "conformsTo" member of a feature collection is absent', async () => {
    const violations = await spectral.run({
      ...featureCollection,
    });

    expect(violations).toContainViolation('/req/core/metadata#A');
  });

  test('Succeeds when the "conformsTo" member of a feature contains the core URI', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when the "conformsTo" member of a feature contains the core CURIE', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_CURIE],
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when the "conformsTo" member of a feature collection contains the core URI', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [CC_CORE_URI],
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when the "conformsTo" member of a feature collection contains the core CURIE', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [CC_CORE_CURIE],
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when the "conformsTo" member of a feature does not contain the core URI/CURIE', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_3D_URI],
    });

    expect(violations).toContainViolation('/req/core/metadata#B');
  });

  test('Fails when the "conformsTo" member of a feature collection does not contain the core URI/CURIE', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [CC_3D_URI],
    });

    expect(violations).toContainViolation('/req/core/metadata#B');
  });

  test('Fails when a member feature of a feature collection contains a "conformsTo" member', async () => {
    const violations = await spectral.run({
      ...featureCollection,
      conformsTo: [CC_CORE_URI],
      features: [
        {
          ...feature,
          conformsTo: [CC_CORE_URI],
        },
      ],
    });

    expect(violations).toContainViolation('/req/core/metadata#C');
  });
});

describe('/req/core/interval', () => {
  test('Fails when start instant is date and end instant is timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        interval: ['2024-02-28', '2024-02-29T10:00:00Z'],
      },
    });

    expect(violations).toContainViolation('/req/core/interval#B');
  });

  test('Fails when start instant is timestamp and end instant is date', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        interval: ['2024-02-28T10:00:00Z', '2024-02-29'],
      },
    });

    expect(violations).toContainViolation('/req/core/interval#C');
  });
});

describe('/req/core/instant-and-interval', () => {
  test('Succeeds when date does match "full-date" part of the timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-28',
        timestamp: '2024-02-28T10:00:00Z',
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when date does not match "full-date" part of the timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-27',
        timestamp: '2024-02-28T10:00:00Z',
      },
    });

    expect(violations).toContainViolation('/req/core/instant-and-interval#A');
  });

  test('Succeeds when date interval contains timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        timestamp: '2024-02-28T10:00:00Z',
        interval: ['2024-02-28', '2024-02-29'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when zero-length date interval matches "full-date" part of timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        timestamp: '2024-02-28T10:00:00Z',
        interval: ['2024-02-28', '2024-02-28'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when date interval does not contain timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        timestamp: '2024-02-27T10:00:00Z',
        interval: ['2024-02-28', '2024-02-29'],
      },
    });

    expect(violations).toContainViolation('/req/core/instant-and-interval#B');
  });

  test('Succeeds when timestamp interval contains timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        timestamp: '2024-02-28T10:00:00Z',
        interval: ['2024-02-28T09:00:00Z', '2024-02-28T11:00:00Z'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when zero-length timestamp interval equals the timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        timestamp: '2024-02-28T10:00:00Z',
        interval: ['2024-02-28T10:00:00Z', '2024-02-28T10:00:00Z'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when timestamp interval does not contain timestamp', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        timestamp: '2024-02-28T08:00:00Z',
        interval: ['2024-02-28T09:00:00Z', '2024-02-28T11:00:00Z'],
      },
    });

    expect(violations).toContainViolation('/req/core/instant-and-interval#C');
  });

  test('Succeeds when date interval contains date', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-28',
        interval: ['2024-02-28', '2024-02-29'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when zero-length date interval equals the date', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-28',
        interval: ['2024-02-28', '2024-02-28'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when date interval does not contain date', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-27',
        interval: ['2024-02-28', '2024-02-28'],
      },
    });

    expect(violations).toContainViolation('/req/core/instant-and-interval#D');
  });

  test('Succeeds when timestamp interval includes timestamps on the date', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-28',
        interval: ['2024-02-28T09:00:00Z', '2024-02-29T11:00:00Z'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Succeeds when "full-date" part of zero-length timestamp interval equals the date', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-28',
        interval: ['2024-02-28T09:00:00Z', '2024-02-28T09:00:00Z'],
      },
    });

    expect(violations).toHaveLength(0);
  });

  test('Fails when timestamp interval does not include timestamps on the date', async () => {
    const violations = await spectral.run({
      ...feature,
      conformsTo: [CC_CORE_URI],
      time: {
        date: '2024-02-28',
        interval: ['2024-02-29T09:00:00Z', '2024-02-29T11:00:00Z'],
      },
    });

    expect(violations).toContainViolation('/req/core/instant-and-interval#E');
  });
});
