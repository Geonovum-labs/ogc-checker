import { RulesetFunction } from '@stoplight/spectral-core';

export const DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

export const isValidDateTime = (input: unknown) => typeof input === 'string' && DATETIME_REGEX.test(input);

// TODO: Support timezone offsets
export const datetime: RulesetFunction<unknown> = async input => {
  if (!isValidDateTime(input)) {
    return [
      {
        message: 'Value does not conform to RFC 3339 (date-time).',
      },
    ];
  }
};
