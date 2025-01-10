import { RulesetDefinition } from '@stoplight/spectral-core';
import { isFeatureTypePresent } from '../functions/isFeatureTypePresent';
import { isValidConformanceTypesSchemas } from '../functions/isValidConformanceTypesSchemas';
import { isValidGeometryDimension } from '../functions/isValidGeometryDimension';

export const CC_TYPES_SCHEMAS_URI = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/types-schemas';
export const CC_TYPES_SCHEMAS_CURIE = '[ogc-json-fg-1-0.2:types-schemas]';

const jsonFgTypesSchemas: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.2/req/types-schemas',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Feature Types and Schemas"',
  rules: {
    '/req/types-schemas/metadata': {
      given: '$',
      severity: 'error',
      then: {
        function: isValidConformanceTypesSchemas,
      },
    },
    '/req/types-schemas/feature-type': {
      given: '$',
      severity: 'error',
      then: {
        function: isFeatureTypePresent,
      },
    },
    '/req/types-schemas/geometry-dimension': {
      given: '$',
      severity: 'error',
      then: {
        function: isValidGeometryDimension,
      },
    },
  },
};

export default jsonFgTypesSchemas;
