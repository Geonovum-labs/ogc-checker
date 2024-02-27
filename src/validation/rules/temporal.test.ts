import { DocumentTypes, Feature } from '../../types';
import { applyRules } from '../ruleValidation';
import temporal from './temporal';

test('Interval start and end may be equal', () => {
  const violations = applyRules(temporal, {
    type: DocumentTypes.FEATURE,
    time: {
      interval: ['2024-02-27', '2024-02-27'],
    },
  } as Feature);

  expect(violations.length).toBe(0);
});

test('Interval start instant may be earlier than end instant', () => {
  const violations = applyRules(temporal, {
    type: DocumentTypes.FEATURE,
    time: {
      interval: ['2024-02-26', '2024-02-27'],
    },
  } as Feature);

  expect(violations.length).toBe(0);
});

test('Interval start instant may not be later than end instant', () => {
  const violations = applyRules(temporal, {
    type: DocumentTypes.FEATURE,
    time: {
      interval: ['2024-02-28', '2024-02-27'],
    },
  } as Feature);

  expect(violations.length).toBe(1);
});
