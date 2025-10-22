import { RulesetFunction } from '@stoplight/spectral-core';
import { GeometryTypes } from '../../../types';
import { errorMessage } from '../../../util';
import { getFeatures, getGeometryDimension, getPlaceType, isFeatureCollection } from './util';

export const isValidGeometryDimension: RulesetFunction<unknown> = input => {
  const geometryDimension = getGeometryDimension(input);

  if (!isFeatureCollection(input) || geometryDimension === undefined) {
    return;
  }

  const features = getFeatures(input);

  if (
    geometryDimension === 0 &&
    features.every(feature => ([GeometryTypes.POINT, GeometryTypes.MULTIPOINT] as string[]).includes(getPlaceType(feature) ?? ''))
  ) {
    return;
  }

  if (
    geometryDimension === 1 &&
    features.every(feature =>
      (
        [
          GeometryTypes.LINESTRING,
          GeometryTypes.CIRCULARSTRING,
          GeometryTypes.COMPOUNDCURVE,
          GeometryTypes.MULTILINESTRING,
          GeometryTypes.MULTICURVE,
        ] as string[]
      ).includes(getPlaceType(feature) ?? '')
    )
  ) {
    return;
  }

  if (
    geometryDimension === 2 &&
    features.every(feature =>
      ([GeometryTypes.POLYGON, GeometryTypes.CURVEPOLYGON, GeometryTypes.MULTIPOLYGON, GeometryTypes.MULTISURFACE] as string[]).includes(
        getPlaceType(feature) ?? ''
      )
    )
  ) {
    return;
  }

  if (
    geometryDimension === 3 &&
    features.every(feature =>
      ([GeometryTypes.POLYHEDRON, GeometryTypes.MULTIPOLYHEDRON, GeometryTypes.PRISM, GeometryTypes.MULTIPRISM] as string[]).includes(
        getPlaceType(feature) ?? ''
      )
    )
  ) {
    return;
  }

  return errorMessage(
    'If the JSON-FG root object is a feature collection with a member "geometryDimension" that is not null, the geometry type of the primary ' +
      'geometry of each feature in the "place" member - or if "place" is null, in the "geometry" member - SHALL be consistent with the value ' +
      '(0: a Point or MultiPoint; 1: a LineString, CircularString, CompoundCurve, MultiLineString, MultiCurve, or CustomCurve; 2: a Polygon, ' +
      'CurvePolygon, MultiPolygon, MultiSurface, or CustomSurface; 3: a Polyhedron, MultiPolyhedron, Prism or MultiPrism).'
  );
};
