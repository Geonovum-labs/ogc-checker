import { Rule } from '../ruleValidation';

const CORE_URI = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/core';

const CORE_CURIE = '[ogc-json-fg-1-0.2:core]';

const rules: Rule[] = [];

rules.push({
  name: '/req/core/interval',
  validateFeature: (feature, isRoot) => {
    const conformsTo = feature.conformsTo;

    if (isRoot && conformsTo === undefined) {
      return {
        pointer: '/',
        message: 'The JSON document SHALL include a "conformsTo" member.',
      };
    }

    if (isRoot && conformsTo !== undefined && !conformsTo.includes(CORE_URI) && !conformsTo.includes(CORE_CURIE)) {
      return {
        pointer: '/conformsTo',
        message: 'The "conformsTo" member of the JSON document SHALL include at least the core conformance class.',
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

    if (conformsTo !== undefined && !conformsTo.includes(CORE_URI) && !conformsTo.includes(CORE_CURIE)) {
      return {
        pointer: '/conformsTo',
        message: 'The "conformsTo" member of the JSON document SHALL include at least the core conformance class.',
      };
    }
  },
});

export default rules;
