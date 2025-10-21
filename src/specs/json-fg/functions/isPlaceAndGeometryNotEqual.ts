import { errorMessage } from '@geonovum/standards-checker/engine/util';
import { RulesetFunction } from '@stoplight/spectral-core';
import { equals } from 'ramda';

export const isPlaceAndGeometryNotEqual: RulesetFunction<unknown> = async input => {
  if (
    !(input && typeof input === 'object') ||
    !('place' in input && input.place !== null) ||
    !('geometry' in input && input.geometry !== null)
  ) {
    return;
  }

  if (equals(input.place, input.geometry)) {
    return errorMessage(
      'If both the "place" and the "geometry" member in a JSON-FG feature in the JSON document are not null, the ' +
        'values of both members SHALL not be identical.'
    );
  }
};