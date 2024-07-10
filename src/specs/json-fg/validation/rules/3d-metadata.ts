import { Feature, FeatureDocument, GeometryTypes } from '../../../../types';
import { Rule } from '../ruleValidation';

export const CC_3D_URI = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/3d';

export const CC_3D_CURIE = '[ogc-json-fg-1-0.2:3d]';

const TYPES_3D = [
  GeometryTypes.POLYHEDRON,
  GeometryTypes.MULTIPOLYHEDRON,
  GeometryTypes.PRISM,
  GeometryTypes.MULTIPRISM,
];

const conformsTo3D = (doc: FeatureDocument) =>
  doc.conformsTo !== undefined && (doc.conformsTo.includes(CC_3D_URI) || doc.conformsTo.includes(CC_3D_CURIE));

const is3D = (feature: Feature) => feature.place !== null && TYPES_3D.includes(feature.place.type);

const rules: Rule[] = [];

rules.push({
  name: '/req/3d/metadata',
  validateFeature: (feature, isRoot) => {
    if (isRoot && is3D(feature) && !conformsTo3D(feature)) {
      return {
        pointer: '/conformsTo',
        message:
          'When having 3D geometries, the "conformsTo" member of the JSON document SHALL include at least the 3D ' +
          'conformance class.',
      };
    }
  },
  validateFeatureCollection: featureCollection => {
    if (featureCollection.features.some(feature => is3D(feature)) && !conformsTo3D(featureCollection)) {
      return {
        pointer: '/conformsTo',
        message:
          'When having 3D geometries, the "conformsTo" member of the JSON document SHALL include at least the 3D ' +
          'conformance class.',
      };
    }
  },
});

export default rules;
