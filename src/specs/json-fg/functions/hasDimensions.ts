import { RulesetFunction } from '@stoplight/spectral-core';
import { Coordinates } from '../../../types';
import { errorMessage } from '../../../util';
import { getDimensions, isValidCoordinateArray } from './util';

interface Options {
  numDimensions: number;
  errorMessage?: string;
  path?: (string | number)[];
}

export const hasDimensions: RulesetFunction<unknown, Options> = (input, options) => {
  if (!(input && typeof input === 'object') || !('coordinates' in input && isValidCoordinateArray(input.coordinates))) {
    return;
  }

  const dimensions = getDimensions(input.coordinates as Coordinates);

  if (dimensions.some(dimension => dimension !== options.numDimensions)) {
    return errorMessage(
      options.errorMessage ?? `All positions in a geometry object SHALL have ${options.numDimensions} dimensions.`,
      options.path
    );
  }
};
