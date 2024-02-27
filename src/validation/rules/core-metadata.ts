import { FeatureDocument } from '../../types';
import { Rule } from '../ruleValidation';

export const CC_CORE_URI = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/core';

export const CC_CORE_CURIE = '[ogc-json-fg-1-0.2:core]';

const conformsToCore = (doc: FeatureDocument) =>
  doc.conformsTo !== undefined && (doc.conformsTo.includes(CC_CORE_URI) || doc.conformsTo.includes(CC_CORE_CURIE));

const rules: Rule[] = [];

rules.push({
  name: '/req/core/metadata',
  validateFeature: (feature, isRoot) => {
    const conformsTo = feature.conformsTo;

    if (isRoot && conformsTo === undefined) {
      return {
        pointer: '/',
        message: 'The JSON document SHALL include a "conformsTo" member.',
      };
    }

    if (isRoot && conformsTo !== undefined && !conformsToCore(feature)) {
      return {
        pointer: '/conformsTo',
        message: 'The "conformsTo" member of the JSON document SHALL include at least the core conformance class.',
      };
    }

    if (!isRoot && conformsTo !== undefined) {
      return {
        pointer: '/conformsTo',
        message: 'Only the root object of the JSON document SHALL include a "conformsTo" member.',
      };
    }
  },
  validateFeatureCollection: featureCollection => {
    const conformsTo = featureCollection.conformsTo;

    if (conformsTo === undefined) {
      return {
        pointer: '/',
        message: 'The JSON document SHALL include a "conformsTo" member.',
      };
    }

    if (conformsTo !== undefined && !conformsToCore(featureCollection)) {
      return {
        pointer: '/conformsTo',
        message: 'The "conformsTo" member of the JSON document SHALL include at least the core conformance class.',
      };
    }
  },
});

export default rules;
