import { RulesetDefinition } from '@stoplight/spectral-core';
import { isValidConformanceTo3D } from '../functions/isValidConformanceTo3D';

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
        function: isValidConformanceTo3D,
      },
    },
  },
};

export default jsonFg3D;
