export enum DocumentTypes {
  FEATURE = 'Feature',
  FEATURE_COLLECTION = 'FeatureCollection',
}

export type FeatureDocument = Feature | FeatureCollection;

export interface Feature {
  type: DocumentTypes.FEATURE;
  conformsTo?: string[];
  time: Time | null;
  place: Geometry | null;
  geometry: Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon | null;
  properties: {
    [key: string]: unknown;
  } | null;
}

export interface FeatureCollection {
  type: DocumentTypes.FEATURE_COLLECTION;
  conformsTo?: string[];
  features: Feature[];
}

export interface Time {
  date?: string;
  timestamp?: string;
  interval?: [string, string];
}

export interface Geometry {
  type: string;
}

export interface Point extends Geometry {
  type: 'Point';
}

export interface MultiPoint extends Geometry {
  type: 'MultiPoint';
}

export interface LineString extends Geometry {
  type: 'LineString';
}

export interface MultiLineString extends Geometry {
  type: 'MultiLineString';
}

export interface Polygon extends Geometry {
  type: 'Polygon';
}

export interface MultiPolygon extends Geometry {
  type: 'MultiPolygon';
}

export interface Polyhedron extends Geometry {
  type: 'Polyhedron';
}

export interface MultiPolyhedron extends Geometry {
  type: 'MultiPolyhedron';
}

export interface Prism extends Geometry {
  type: 'Prism';
}

export interface MultiPrism extends Geometry {
  type: 'MultiPrism';
}
