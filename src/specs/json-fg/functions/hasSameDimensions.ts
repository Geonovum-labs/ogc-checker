import { RulesetFunction } from '@stoplight/spectral-core';
import { Coordinates } from '../../../types';
import { errorMessage } from '../../../util';
import { getDimensions, isValidCoordinateArray } from './util';

export const hasSameDimensions: RulesetFunction<unknown> = input => {
  if (!(input && typeof input === 'object') || !('coordinates' in input && isValidCoordinateArray(input.coordinates))) {
    return;
  }

  const dimensions = getDimensions(input.coordinates as Coordinates);

  if (dimensions.some(dimension => dimension !== dimensions[0])) {
    return errorMessage('All positions in a geometry object SHALL have the same dimension.');
  }
};
