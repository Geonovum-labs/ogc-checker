import { RulesetFunction } from '@stoplight/spectral-core';

export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export const isValidDate = (input: unknown) => typeof input === 'string' && DATE_REGEX.test(input);

export const date: RulesetFunction<unknown> = async input => {
  if (!isValidDate(input)) {
    return [
      {
        message: 'Value does not conform to RFC 3339 (full-date).',
      },
    ];
  }
};
