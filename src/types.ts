export enum DocumentTypes {
  FEATURE = 'Feature',
  FEATURECOLLECTION = 'FeatureCollection',
}

export enum GeometryTypes {
  POINT = 'Point',
  MULTIPOINT = 'MultiPoint',
  LINESTRING = 'LineString',
  MULTILINESTRING = 'MultiLineString',
  POLYGON = 'Polygon',
  MULTIPOLYGON = 'MultiPolygon',
  POLYHEDRON = 'Polyhedron',
  MULTIPOLYHEDRON = 'MultiPolyhedron',
  PRISM = 'Prism',
  MULTIPRISM = 'MultiPrism',
}

export type FeatureDocument = Feature | FeatureCollection;

export interface Feature {
  type: DocumentTypes.FEATURE;
  conformsTo?: string[];
  featureType?: string | string[];
  featureSchema?: string;
  time: Time | null;
  place: Place | null;
  geometry: Geometry | null;
  properties: {
    [key: string]: unknown;
  } | null;
}

export interface FeatureCollection {
  type: DocumentTypes.FEATURECOLLECTION;
  conformsTo?: string[];
  featureType?: string | string[];
  featureSchema?: string;
  features: Feature[];
}

export interface Time {
  date?: string;
  timestamp?: string;
  interval?: [string, string];
}

export type Geometry = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon;

export type Place = Geometry | Polyhedron | MultiPolyhedron | Prism | MultiPrism;

export type Position2D = [number, number];

export type Position3D = [number, number, number];

export type Position = Position2D | Position3D;

export interface Point {
  type: GeometryTypes.POINT;
  coordinates: Position;
}

export interface MultiPoint {
  type: GeometryTypes.MULTIPOINT;
  coordinates: Position[];
}

export interface LineString {
  type: GeometryTypes.LINESTRING;
  coordinates: Position[];
}

export interface MultiLineString {
  type: GeometryTypes.MULTILINESTRING;
  coordinates: Position[][];
}

export interface Polygon {
  type: GeometryTypes.POLYGON;
  coordinates: Position[][];
}

export interface MultiPolygon {
  type: GeometryTypes.MULTIPOLYGON;
  coordinates: Position[][][];
}

export interface Polyhedron {
  type: GeometryTypes.POLYHEDRON;
  coordinates: Position3D[][][][];
}

export interface MultiPolyhedron {
  type: GeometryTypes.MULTIPOLYHEDRON;
  coordinates: Position3D[][][][][];
}

export interface Prism {
  type: GeometryTypes.PRISM;
  base: Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon;
  lower?: number;
  upper: number;
}

export interface MultiPrism {
  type: GeometryTypes.MULTIPRISM;
  prisms: Prism[];
}
