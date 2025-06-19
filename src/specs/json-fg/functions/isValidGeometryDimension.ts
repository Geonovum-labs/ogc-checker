import { RulesetFunction } from '@stoplight/spectral-core';
import { errorMessage } from '../../../util';
import { getFeatures, getGeometryDimension, getPlaceType, isFeatureCollection } from './util';

export const isValidGeometryDimension: RulesetFunction<unknown> = async input => {
  const geometryDimension = getGeometryDimension(input);

  if (!isFeatureCollection(input) || geometryDimension === undefined) {
    return;
  }

  const features = getFeatures(input);

  if (geometryDimension === 0 && features.every(feature => ['Point', 'MultiPoint'].includes(getPlaceType(feature) ?? ''))) {
    return;
  }

  if (geometryDimension === 1 && features.every(feature => ['LineString', 'MultiLineString'].includes(getPlaceType(feature) ?? ''))) {
    return;
  }

  if (geometryDimension === 2 && features.every(feature => ['Polygon', 'MultiPolygon'].includes(getPlaceType(feature) ?? ''))) {
    return;
  }

  if (
    geometryDimension === 3 &&
    features.every(feature => ['Polyhedron', 'MultiPolyhedron', 'Prism', 'MultiPrism'].includes(getPlaceType(feature) ?? ''))
  ) {
    return;
  }

  return errorMessage(
    'If the JSON document is a JSON-FG feature collection with a member "geometryDimension" that is not null, the ' +
      'geometry type of the primary geometry of each feature in the "place" member - or if "place" is null, in the ' +
      '"geometry" member - SHALL be consistent with the value (0: a Point or MultiPoint, 1: a LineString or ' +
      'MultiLineString, 2: a Polygon or MultiPolygon, 3: a Polyhedron, MultiPolyhedron, Prism or MultiPrism).'
  );
};
