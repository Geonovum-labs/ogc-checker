import { RulesetDefinition } from '@stoplight/spectral-core';
import { isFeatureTypePresent } from '../functions/isFeatureTypePresent';
import { isValidConformanceTypesSchemas } from '../functions/isValidConformanceTypesSchemas';
import { isValidGeometryDimension } from '../functions/isValidGeometryDimension';

export const JSON_FG_TYPES_SCHEMAS_URI = 'http://www.opengis.net/spec/json-fg-1/0.3/conf/types-schemas';

export const JSON_FG_TYPES_SCHEMAS_CURIE = '[ogc-json-fg-1-0.3:types-schemas]';

export const JSON_FG_TYPES_SCHEMAS_DOC_URI = 'https://docs.ogc.org/DRAFTS/21-045.html#types-schemas_';

const jsonFgTypesSchemas: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.3/req/types-schemas',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Feature Types and Schemas"',
  rules: {
    '/req/types-schemas/metadata': {
      given: '$',
      documentationUrl: JSON_FG_TYPES_SCHEMAS_DOC_URI + 'metadata',
      severity: 'error',
      then: {
        function: isValidConformanceTypesSchemas,
      },
    },
    '/req/types-schemas/feature-type': {
      given: '$',
      documentationUrl: JSON_FG_TYPES_SCHEMAS_DOC_URI + 'feature-type',
      severity: 'error',
      then: {
        function: isFeatureTypePresent,
      },
    },
    '/req/types-schemas/geometry-dimension': {
      given: '$',
      documentationUrl: JSON_FG_TYPES_SCHEMAS_DOC_URI + 'geometry-dimension',
      severity: 'error',
      then: {
        function: isValidGeometryDimension,
      },
    },
  },
};

export default jsonFgTypesSchemas;
