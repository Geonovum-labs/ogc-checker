import { RulesetFunction } from '@stoplight/spectral-core';
import { errorMessage } from '@geonovum/standards-checker/engine/util';
import { isValidCoordinateArray } from './util';
import { Coordinates, Position } from '@geonovum/standards-checker';

interface Options {
  x?: [number, number];
  y?: [number, number];
}

const getPositions = (coordinates: Coordinates): Position[] => {
  if (coordinates.every(c => typeof c === 'number')) {
    return [coordinates];
  }

  return coordinates.flatMap(c => getPositions(c));
};

export const hasPositionRange: RulesetFunction<unknown, Options> = async (input, options) => {
  if (!(input && typeof input === 'object') || !('coordinates' in input && isValidCoordinateArray(input.coordinates))) {
    return;
  }

  const positions = getPositions(input.coordinates as Coordinates);

  for (const position of positions) {
    if (options.x !== undefined && (position[0] < options.x[0] || position[0] > options.x[1])) {
      return errorMessage(
        'If the "geometry" member in a JSON-FG feature in the JSON document is not null, the first element of each position SHALL be between -180 and +180 decimal degrees longitude.'
      );
    }

    if (options.y !== undefined && (position[1] < options.y[0] || position[1] > options.y[1])) {
      return errorMessage(
        'If the "geometry" member in a JSON-FG feature in the JSON document is not null, the second element of each position SHALL be between -90 and +90 decimal degrees latitude.'
      );
    }
  }
};
