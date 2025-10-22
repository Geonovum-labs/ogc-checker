import { RulesetFunction } from '@stoplight/spectral-core';
import { Coordinates } from '../../../types';
import { errorMessage } from '../../../util';
import { getDimensions, isValidCoordinateArray } from './util';

interface Options {
  numDimensions: number;
}

export const hasDimensions: RulesetFunction<unknown, Options> = async (input, options) => {
  if (!(input && typeof input === 'object') || !('coordinates' in input && isValidCoordinateArray(input.coordinates))) {
    return;
  }

  const dimensions = getDimensions(input.coordinates as Coordinates);

  if (dimensions.some(dimension => dimension !== options.numDimensions)) {
    return errorMessage('All positions in a geometry object SHALL have the same dimension.');
  }
};
