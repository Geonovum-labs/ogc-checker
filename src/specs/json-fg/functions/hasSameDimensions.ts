import { RulesetFunction } from '@stoplight/spectral-core';
import { errorMessage } from 'standards-checker/engine/util';
import { isValidCoordinateArray } from './util';
import { Coordinates } from 'standards-checker';

const getDimensions = (coordinates: Coordinates): number[] => {
  if (typeof coordinates[0] === 'number') {
    return [coordinates.length];
  }

  return coordinates.flatMap(c => getDimensions(c as Coordinates));
};

export const hasSameDimensions: RulesetFunction<unknown> = async input => {
  if (!(input && typeof input === 'object') || !('coordinates' in input && isValidCoordinateArray(input.coordinates))) {
    return;
  }

  const dimensions = getDimensions(input.coordinates as Coordinates);

  if (dimensions.some(dimension => dimension !== dimensions[0])) {
    return errorMessage('All positions in a geometry object SHALL have the same dimension.');
  }
};
