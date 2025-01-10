import { RulesetFunction } from '@stoplight/spectral-core';
import { errorMessage } from '../../../util';
import { JSON_FG_TYPES_SCHEMAS_CURIE, JSON_FG_TYPES_SCHEMAS_URI } from '../rulesets/types-schemas';
import { getConformsTo, isFeature, isFeatureCollection } from './util';

const documentContainsFeatureType = (input: unknown) =>
  input && typeof input === 'object' && 'featureType' in input && typeof input.featureType === 'string';

const allFeaturesContainFeatureType = (input: unknown) =>
  input &&
  typeof input === 'object' &&
  'features' in input &&
  Array.isArray(input.features) &&
  input.features.every(documentContainsFeatureType);

const someFeaturesContainFeatureType = (input: unknown) =>
  input &&
  typeof input === 'object' &&
  'features' in input &&
  Array.isArray(input.features) &&
  input.features.every(documentContainsFeatureType);

export const isFeatureTypePresent: RulesetFunction<unknown> = async input => {
  const conformsTo = getConformsTo(input);

  if (!conformsTo.includes(JSON_FG_TYPES_SCHEMAS_URI) && !conformsTo.includes(JSON_FG_TYPES_SCHEMAS_CURIE)) {
    return;
  }

  if (isFeature(input) && !documentContainsFeatureType(input)) {
    return errorMessage(
      'If the JSON document is a JSON-FG feature, the feature object SHALL have a member "featureType".'
    );
  }

  if (
    isFeatureCollection(input) &&
    ((documentContainsFeatureType(input) && someFeaturesContainFeatureType(input)) ||
      (!documentContainsFeatureType(input) && !allFeaturesContainFeatureType(input)))
  ) {
    return errorMessage(
      'If the JSON document is a JSON-FG feature collection, either the feature collection object SHALL have a member ' +
        '"featureType" or each feature object SHALL have a member "featureType".'
    );
  }
};
