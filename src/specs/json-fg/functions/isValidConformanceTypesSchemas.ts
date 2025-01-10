import { RulesetFunction } from '@stoplight/spectral-core';
import { errorMessage } from '../../../util';
import { JSON_FG_TYPES_SCHEMAS_CURIE, JSON_FG_TYPES_SCHEMAS_URI } from '../rulesets/types-schemas';
import { getConformsTo } from './util';

const featureContainsFeatureType = (input: unknown) =>
  input && typeof input === 'object' && 'featureType' in input && typeof input.featureType === 'string';

const featureCollectionContainsFeatureType = (input: unknown) =>
  input &&
  typeof input === 'object' &&
  'features' in input &&
  Array.isArray(input.features) &&
  input.features.some(featureContainsFeatureType);

export const isValidConformanceTypesSchemas: RulesetFunction<unknown> = async input => {
  if (featureContainsFeatureType(input) || featureCollectionContainsFeatureType(input)) {
    const conformsTo = getConformsTo(input);

    if (!conformsTo.includes(JSON_FG_TYPES_SCHEMAS_URI) && !conformsTo.includes(JSON_FG_TYPES_SCHEMAS_CURIE)) {
      return errorMessage(
        'When the "featureType" member is present, the "conformsTo" member of the JSON document SHALL include at ' +
          'least the Feature Types and Schemas conformance class.'
      );
    }
  }
};
