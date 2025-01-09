export const isValidCoordinateArray = (value: unknown): boolean =>
  Array.isArray(value) &&
  ((value.every(item => typeof item === 'number') && [2, 3].includes(value.length)) ||
    value.every(item => isValidCoordinateArray(item)));

export const getConformsTo = (input: unknown): string[] =>
  input &&
  typeof input === 'object' &&
  'conformsTo' in input &&
  Array.isArray(input.conformsTo) &&
  input.conformsTo.every(c => typeof c === 'string')
    ? input.conformsTo
    : [];
