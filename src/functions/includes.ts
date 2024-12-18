import { RulesetFunction } from '@stoplight/spectral-core';

interface Options {
  anyOf?: string[];
}

export const includes: RulesetFunction<unknown, Options | undefined> = async (input, options) => {
  if (!options || !Array.isArray(input)) {
    return;
  }

  const { anyOf } = options;

  if (anyOf) {
    const matches = input.filter(value => anyOf.includes(value));

    if (matches.length === 0) {
      return [
        {
          message: `The list must include at least one of the two following values: ${anyOf.join(', ')}.`,
        },
      ];
    }
  }
};
