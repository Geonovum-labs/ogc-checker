import { Feature, FeatureDocument, GeometryTypes } from '../../../../types';
import { Rule } from '../ruleValidation';

export const CC_TYPES_SCHEMAS_URI = 'http://www.opengis.net/spec/json-fg-1/0.2/conf/types-schemas';

export const CC_TYPES_SCHEMAS_CURIE = '[ogc-json-fg-1-0.2:types-schemas]';

const conformsToTypesSchemas = (doc: FeatureDocument) =>
  doc.conformsTo !== undefined &&
  (doc.conformsTo.includes(CC_TYPES_SCHEMAS_URI) || doc.conformsTo.includes(CC_TYPES_SCHEMAS_CURIE));

const containsValidTypes = (feature: Feature, allowedTypes: GeometryTypes[]) => {
  if (feature.place !== null) {
    return allowedTypes.includes(feature.place.type);
  } else if (feature.geometry !== null) {
    return allowedTypes.includes(feature.geometry.type);
  } else {
    return true;
  }
};

const rules: Rule[] = [];

rules.push({
  name: '/req/types-schemas/metadata',
  validateFeature: (feature, isRoot) => {
    if (isRoot && feature.featureType !== undefined && !conformsToTypesSchemas(feature)) {
      return {
        pointer: '/conformsTo',
        message:
          'When the "featureType" member is present, the "conformsTo" member of the JSON document SHALL include at ' +
          'least the Feature Types and Schemas conformance class.',
      };
    }
  },
  validateFeatureCollection: featureCollection => {
    if (
      (featureCollection.featureType !== undefined ||
        featureCollection.features.some(feature => feature.featureType !== undefined)) &&
      !conformsToTypesSchemas(featureCollection)
    ) {
      return {
        pointer: '/conformsTo',
        message:
          'When the "featureType" member is present, the "conformsTo" member of the JSON document SHALL include at ' +
          'least the Feature Types and Schemas conformance class.',
      };
    }
  },
});

rules.push({
  name: '/req/types-schemas/feature-type',
  validateFeature: (feature, isRoot) => {
    if (isRoot && conformsToTypesSchemas(feature) && feature.featureType === undefined) {
      return {
        pointer: '/conformsTo',
        message:
          'When the document conforms to the Feature Types and Schemas conformance class, the "featureType" member ' +
          'must be present.',
      };
    }
  },
  validateFeatureCollection: featureCollection => {
    if (
      conformsToTypesSchemas(featureCollection) &&
      featureCollection.featureType === undefined &&
      featureCollection.features.every(feature => feature.featureType === undefined)
    ) {
      return {
        pointer: '/conformsTo',
        message:
          'When the document conforms to the Feature Types and Schemas conformance class, the "featureType" member ' +
          'must be present in either the collection or in every individual feature.',
      };
    }

    if (
      conformsToTypesSchemas(featureCollection) &&
      featureCollection.featureType !== undefined &&
      featureCollection.features.some(feature => feature.featureType !== undefined)
    ) {
      return {
        pointer: '/conformsTo',
        message:
          'When the document contains a "featureType" member, individual members may not contain a "featureType" member.',
      };
    }

    if (
      conformsToTypesSchemas(featureCollection) &&
      featureCollection.featureType === undefined &&
      featureCollection.features.some(feature => feature.featureType !== undefined) &&
      !featureCollection.features.every(feature => feature.featureType !== undefined)
    ) {
      return {
        pointer: '/conformsTo',
        message:
          'When the document does not contain a "featureType" member, every individual feature must contain a "featureType" member.',
      };
    }
  },
});

rules.push({
  name: '/req/types-schemas/geometry-dimension',
  validateFeatureCollection: featureCollection => {
    if (
      featureCollection.geometryDimension === 0 &&
      featureCollection.features.some(
        feature => !containsValidTypes(feature, [GeometryTypes.POINT, GeometryTypes.MULTIPOINT])
      )
    ) {
      return {
        pointer: '/geometryDimension',
        message:
          'When the "geometryDimension" member of a feature collection has value 0, member features may only contain (Multi)Point primary geometries.',
      };
    }

    if (
      featureCollection.geometryDimension === 1 &&
      featureCollection.features.some(
        feature => !containsValidTypes(feature, [GeometryTypes.LINESTRING, GeometryTypes.MULTILINESTRING])
      )
    ) {
      return {
        pointer: '/geometryDimension',
        message:
          'When the "geometryDimension" member of a feature collection has value 1, member features may only contain (Multi)LineString primary geometries.',
      };
    }

    if (
      featureCollection.geometryDimension === 2 &&
      featureCollection.features.some(
        feature => !containsValidTypes(feature, [GeometryTypes.POLYGON, GeometryTypes.MULTIPOLYGON])
      )
    ) {
      return {
        pointer: '/geometryDimension',
        message:
          'When the "geometryDimension" member of a feature collection has value 2, member features may only contain (Multi)Polygon primary geometries.',
      };
    }

    if (
      featureCollection.geometryDimension === 3 &&
      featureCollection.features.some(
        feature =>
          !containsValidTypes(feature, [
            GeometryTypes.POLYHEDRON,
            GeometryTypes.MULTIPOLYHEDRON,
            GeometryTypes.PRISM,
            GeometryTypes.MULTIPRISM,
          ])
      )
    ) {
      return {
        pointer: '/geometryDimension',
        message:
          'When the "geometryDimension" member of a feature collection has value 3, member features may only contain (Multi)Polygon primary geometries.',
      };
    }
  },
});

export default rules;
