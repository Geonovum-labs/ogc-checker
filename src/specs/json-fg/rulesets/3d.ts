import { RulesetDefinition } from '@stoplight/spectral-core';
import { isValidConformsTo3D } from '../functions/isValidConformsTo3D';

export const CC_3D_URI = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/3d';
export const CC_3D_CURIE = '[ogc-json-fg-1-0.2:3d]';

const jsonFg3D: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.2/req/3d',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "3D"',
  rules: {
    '/req/3d/metadata': {
      given: '$',
      severity: 'error',
      then: {
        function: isValidConformsTo3D,
      },
    },
  },
};

export default jsonFg3D;
