import { RulesetFunction } from '@stoplight/spectral-core';
import { JSON_FG_3D_CURIE, JSON_FG_3D_URI } from '../rulesets/3d';
import { getConformsTo } from './util';
import { errorMessage } from '@geonovum/standards-checker/engine/util';

const TYPES_3D = ['Polyhedron', 'MultiPolyhedron', 'Prism', 'MultiPrism'];

const is3dPlace = (input: unknown) =>
  input && typeof input === 'object' && 'type' in input && typeof input.type === 'string' && TYPES_3D.includes(input.type);

const featureContains3dPlace = (input: unknown) => input && typeof input === 'object' && 'place' in input && is3dPlace(input.place);

const featureCollectionContains3dPlace = (input: unknown) =>
  input && typeof input === 'object' && 'features' in input && Array.isArray(input.features) && input.features.some(featureContains3dPlace);

export const isValidConformanceTo3D: RulesetFunction<unknown> = async input => {
  if (featureContains3dPlace(input) || featureCollectionContains3dPlace(input)) {
    const conformsTo = getConformsTo(input);

    if (!conformsTo.includes(JSON_FG_3D_URI) && !conformsTo.includes(JSON_FG_3D_CURIE)) {
      return errorMessage(
        'When having 3D geometries, the "conformsTo" member of the JSON document SHALL include at least the 3D ' + 'conformance class.'
      );
    }
  }
};
