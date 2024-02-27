import { CoordRefSys, GeometryTypes, Place, Position, RefSysByRef } from '../../types';
import { Rule } from '../ruleValidation';

const GEOJSON_TYPES = [
  GeometryTypes.POINT,
  GeometryTypes.MULTIPOINT,
  GeometryTypes.LINESTRING,
  GeometryTypes.MULTILINESTRING,
  GeometryTypes.POLYGON,
  GeometryTypes.MULTIPOLYGON,
  GeometryTypes.GEOMETRYCOLLECTION,
];

const CRS84_URIS = [
  'http://www.opengis.net/def/crs/OGC/0/CRS84',
  'http://www.opengis.net/def/crs/OGC/0/CRS84h',
  '[OGC:CRS84]',
  '[OGC:CRS84h]',
];

type Coordinates = Position | Position[] | Position[][] | Position[][][] | Position[][][][] | Position[][][][][];

const getDimensions = (coordinates: Coordinates): number[] => {
  if (typeof coordinates[0] === 'number') {
    return [coordinates.length];
  }

  return coordinates.flatMap(c => getDimensions(c as Exclude<Coordinates, Position>));
};

const getElements = (coordinates: Coordinates, index: number): number[] => {
  if (typeof coordinates[0] === 'number') {
    return [coordinates[index] as number];
  }

  return coordinates.flatMap(c => getElements(c as Exclude<Coordinates, Position>, index));
};

const isGeoJsonType = (place: Place) => GEOJSON_TYPES.includes(place.type);

const isCrs84 = (coordRefSys: CoordRefSys) => {
  if (typeof coordRefSys === 'string') {
    return CRS84_URIS.includes(coordRefSys);
  } else if (!Array.isArray(coordRefSys) && coordRefSys.type === 'Reference') {
    const refSysByRef = coordRefSys as RefSysByRef;
    return refSysByRef.epoch === undefined && CRS84_URIS.includes(refSysByRef.href);
  } else {
    return false;
  }
};

const rules: Rule[] = [];

rules.push({
  name: '/req/core/coordinate-dimension',
  validateFeature: feature => {
    if (feature.geometry !== null) {
      const geometry = feature.geometry;

      const dimensions =
        geometry.type === GeometryTypes.GEOMETRYCOLLECTION
          ? geometry.geometries.flatMap(g => getDimensions(g.coordinates))
          : getDimensions(geometry.coordinates);

      if (dimensions.some(dimension => dimension !== dimensions[0])) {
        return {
          pointer: '/geometry',
          message: 'All positions in a geometry object SHALL have the same dimension.',
        };
      }
    }

    if (feature.place !== null) {
      const geometry = feature.place;
      let dimensions: number[] = [];

      if (geometry.type === GeometryTypes.PRISM) {
        dimensions = getDimensions(geometry.base.coordinates);
      } else if (geometry.type === GeometryTypes.MULTIPRISM) {
        dimensions = geometry.prisms.flatMap(p => getDimensions(p.base.coordinates));
      } else if (geometry.type === GeometryTypes.GEOMETRYCOLLECTION) {
        dimensions = geometry.geometries.flatMap(g => getDimensions(g.coordinates));
      } else {
        dimensions = getDimensions(geometry.coordinates);
      }

      if (dimensions.some(dimension => dimension !== dimensions[0])) {
        return {
          pointer: '/place',
          message: 'All positions in a geometry object SHALL have the same dimension.',
        };
      }
    }
  },
});

rules.push({
  name: '/req/core/geometry-wgs84',
  validateFeature: feature => {
    if (feature.geometry !== null) {
      const geometry = feature.geometry;

      const longDegrees =
        geometry.type === GeometryTypes.GEOMETRYCOLLECTION
          ? geometry.geometries.flatMap(g => getElements(g.coordinates, 0))
          : getElements(geometry.coordinates, 0);

      if (longDegrees.some(degree => degree < -180 || degree > 180)) {
        return {
          pointer: '/geometry',
          message: 'The first element of each position SHALL be between -180 and +180 decimal degrees longitude.',
        };
      }

      const latDegrees =
        geometry.type === GeometryTypes.GEOMETRYCOLLECTION
          ? geometry.geometries.flatMap(g => getElements(g.coordinates, 1))
          : getElements(geometry.coordinates, 1);

      if (latDegrees.some(degree => degree < -90 || degree > 90)) {
        return {
          pointer: '/geometry',
          message: 'The second element of each position SHALL be between -90 and +90 decimal degrees latitude.',
        };
      }
    }
  },
});

rules.push({
  name: '/req/core/place',
  validateFeature: feature => {
    if (feature.place !== null) {
      const place = feature.place;
      const coordRefSys = place.coordRefSys ?? feature.coordRefSys;

      if (isGeoJsonType(feature.place) && (coordRefSys === undefined || isCrs84(coordRefSys))) {
        return {
          pointer: '/place',
          message:
            'If the "place" member in any JSON-FG feature in the JSON document is not null and the geometry ' +
            'type (member "type") is one of "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", ' +
            '"MultiPolygon" or "GeometryCollection", the CRS SHALL not be OGC:CRS84 or OGC:CRS84h (WGS 84 with axis ' +
            'order longitude/latitude).',
        };
      }
    }
  },
  validateFeatureCollection: featureCollection => {
    featureCollection.features.forEach((feature, i) => {
      if (feature.place !== null) {
        const place = feature.place;
        const coordRefSys = place.coordRefSys ?? feature.coordRefSys ?? featureCollection.coordRefSys;

        if (isGeoJsonType(feature.place) && (coordRefSys === undefined || isCrs84(coordRefSys))) {
          return {
            pointer: '/features/' + i + '/place',
            message:
              'If the "place" member in any JSON-FG feature in the JSON document is not null and the geometry ' +
              'type (member "type") is one of "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", ' +
              '"MultiPolygon" or "GeometryCollection", the CRS SHALL not be OGC:CRS84 or OGC:CRS84h (WGS 84 with axis ' +
              'order longitude/latitude).',
          };
        }
      }
    });
  },
});

rules.push({
  name: '/req/core/geometry-collection',
  validateFeature: feature => {
    if (feature.place !== null) {
      const place = feature.place;

      if (
        (place.type === GeometryTypes.GEOMETRYCOLLECTION && place.geometries.some(g => g.coordRefSys !== undefined)) ||
        (place.type === GeometryTypes.PRISM && place.base.coordRefSys !== undefined) ||
        (place.type === GeometryTypes.MULTIPRISM &&
          place.prisms.some(g => g.coordRefSys !== undefined || g.base.coordRefSys !== undefined))
      ) {
        return {
          pointer: '/place',
          message:
            'If the "place" member in any JSON-FG feature in the JSON document is not null and the geometry type ' +
            '(member "type") is "GeometryCollection" or any other geometry type that has embedded geometry objects, ' +
            'no embedded geometry object SHALL include a "coordRefSys" member.',
        };
      }
    }
  },
});

rules.push({
  name: '/req/core/fallback',
  validateFeature: feature => {
    if (
      feature.place !== null &&
      feature.geometry !== null &&
      JSON.stringify(feature.place) === JSON.stringify(feature.geometry)
    ) {
      return {
        pointer: '/place',
        message:
          'If both the "place" and the "geometry" member in a JSON-FG feature in the JSON document are not null, the ' +
          'values of both members SHALL not be identical.',
      };
    }
  },
});

export default rules;
