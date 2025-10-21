import { getParent, queryPath, errorMessage } from '@geonovum/standards-checker/engine/util';
import { RulesetFunction } from '@stoplight/spectral-core';

const GEOJSON_TYPES = ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon', 'GeometryCollection'];

const CRS84_URIS = ['http://www.opengis.net/def/crs/OGC/0/CRS84', 'http://www.opengis.net/def/crs/OGC/0/CRS84h'];

const isCrs84 = (coordRefSys: unknown) => {
  if (typeof coordRefSys === 'string') {
    return CRS84_URIS.includes(coordRefSys);
  }

  if (
    coordRefSys &&
    typeof coordRefSys === 'object' &&
    'type' in coordRefSys &&
    coordRefSys.type === 'Reference' &&
    !('epoch' in coordRefSys) &&
    'href' in coordRefSys &&
    typeof coordRefSys.href === 'string'
  ) {
    return CRS84_URIS.includes(coordRefSys.href);
  }

  return false;
};

export const isValidPlaceCrs: RulesetFunction<unknown> = async (input, _options, context) => {
  if (!(input && typeof input === 'object') || !('type' in input && typeof input.type === 'string' && GEOJSON_TYPES.includes(input.type))) {
    return;
  }

  if ('coordRefSys' in input && !isCrs84(input.coordRefSys)) {
    return;
  }

  const feature = await getParent(context);

  if (feature && typeof feature === 'object' && 'coordRefSys' in feature && !isCrs84(feature.coordRefSys)) {
    return;
  }

  if (context.path.length > 1) {
    const featureCollection = await queryPath(context, '$');

    if (
      featureCollection &&
      typeof featureCollection === 'object' &&
      'coordRefSys' in featureCollection &&
      !isCrs84(featureCollection.coordRefSys)
    ) {
      return;
    }
  }

  return errorMessage(
    'If the "place" member in any JSON-FG feature in the JSON document is not null and the geometry type (member ' +
      '"type") is one of "Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon" or ' +
      '"GeometryCollection", the CRS SHALL not be OGC:CRS84 or OGC:CRS84h (WGS 84 with axis order longitude/latitude).'
  );
};