export const isValidCoordinateArray = (value: unknown): boolean =>
  Array.isArray(value) &&
  ((value.every(item => typeof item === 'number') && [2, 3].includes(value.length)) ||
    value.every(item => isValidCoordinateArray(item)));
