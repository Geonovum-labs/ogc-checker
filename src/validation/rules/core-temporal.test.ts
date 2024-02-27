import { DocumentTypes, Feature } from '../../types';
import { applyRules } from '../ruleValidation';
import temporal from './core-temporal';

describe('Requirement 3B', () => {
  test('Succeeds when start and end instants are equal', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        interval: ['2024-02-27', '2024-02-27'],
      },
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Succeeds when start instant is earlier than end instant', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        interval: ['2024-02-26', '2024-02-27'],
      },
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Fails when start instant is later than end instant', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        interval: ['2024-02-28', '2024-02-27'],
      },
    } as Feature);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 4B', () => {
  test('Fails when start instant is date and end instant is timestamp', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        interval: ['2024-02-28', '2024-02-29T10:00:00Z'],
      },
    } as Feature);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 4C', () => {
  test('Fails when start instant is timestamp and end instant is date', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        interval: ['2024-02-28T10:00:00Z', '2024-02-29'],
      },
    } as Feature);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 5A', () => {
  test('Succeeds when date does match "full-date" part of the timestamp', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        date: '2024-02-28',
        timestamp: '2024-02-28T10:00:00Z',
      },
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Fails when date does not match "full-date" part of the timestamp', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        date: '2024-02-27',
        timestamp: '2024-02-28T10:00:00Z',
      },
    } as Feature);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 5B', () => {
  test('Succeeds when date interval contains timestamp', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        timestamp: '2024-02-28T10:00:00Z',
        interval: ['2024-02-28', '2024-02-29'],
      },
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Succeeds when zero-length date interval matches "full-date" part of timestamp', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        timestamp: '2024-02-28T10:00:00Z',
        interval: ['2024-02-28', '2024-02-28'],
      },
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Fails when date interval does not contain timestamp', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        timestamp: '2024-02-27T10:00:00Z',
        interval: ['2024-02-28', '2024-02-29'],
      },
    } as Feature);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 5C', () => {
  test('Succeeds when timestamp interval contains timestamp', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        timestamp: '2024-02-28T10:00:00Z',
        interval: ['2024-02-28T09:00:00Z', '2024-02-28T11:00:00Z'],
      },
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Succeeds when zero-length timestamp interval equals the timestamp', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        timestamp: '2024-02-28T10:00:00Z',
        interval: ['2024-02-28T10:00:00Z', '2024-02-28T10:00:00Z'],
      },
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Fails when timestamp interval does not contain timestamp', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        timestamp: '2024-02-28T08:00:00Z',
        interval: ['2024-02-28T09:00:00Z', '2024-02-28T11:00:00Z'],
      },
    } as Feature);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 5D', () => {
  test('Succeeds when date interval contains date', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        timestamp: '2024-02-28',
        interval: ['2024-02-28', '2024-02-29'],
      },
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Succeeds when zero-length date interval equals the date', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        timestamp: '2024-02-28',
        interval: ['2024-02-28', '2024-02-28'],
      },
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Fails when date interval does not contain date', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        timestamp: '2024-02-27',
        interval: ['2024-02-28', '2024-02-28'],
      },
    } as Feature);

    expect(violations.length).toBe(1);
  });
});

describe('Requirement 5E', () => {
  test('Succeeds when timestamp interval includes timestamps on the date', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        date: '2024-02-28',
        interval: ['2024-02-28T09:00:00Z', '2024-02-29T11:00:00Z'],
      },
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Succeeds when "full-date" part of zero-length timestamp interval equals the date', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        date: '2024-02-28',
        interval: ['2024-02-28T09:00:00Z', '2024-02-28T09:00:00Z'],
      },
    } as Feature);

    expect(violations.length).toBe(0);
  });

  test('Fails when timestamp interval does not include timestamps on the date', () => {
    const violations = applyRules(temporal, {
      type: DocumentTypes.FEATURE,
      time: {
        date: '2024-02-28',
        interval: ['2024-02-29T09:00:00Z', '2024-02-29T11:00:00Z'],
      },
    } as Feature);

    expect(violations.length).toBe(1);
  });
});
