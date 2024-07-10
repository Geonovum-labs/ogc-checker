export interface Spec {
  name: string;
  slug: string;
  example?: string;
}

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
  GEOMETRYCOLLECTION = 'GeometryCollection',
}

export type FeatureDocument = Feature | FeatureCollection;

export interface Feature {
  type: DocumentTypes.FEATURE;
  conformsTo?: string[];
  featureType?: string | string[];
  featureSchema?: string;
  time: Time | null;
  coordRefSys?: CoordRefSys;
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
  geometryDimension?: number;
  featureSchema?: string;
  coordRefSys?: CoordRefSys;
  features: Feature[];
}

export interface Time {
  date?: string;
  timestamp?: string;
  interval?: [string, string];
}

export type CoordRefSys = SingleRefSys | SingleRefSys[];

export interface RefSysByRef {
  type: 'Reference';
  href: string;
  epoch?: number;
}

export interface RefSysCustom {
  type: string;
}

export type SingleRefSys = string | RefSysByRef | RefSysCustom;

export type Geometry = Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon | GeometryCollection;

export type Place = Geometry | Polyhedron | MultiPolyhedron | Prism | MultiPrism;

export type Position2D = [number, number];

export type Position3D = [number, number, number];

export type Position = Position2D | Position3D;

export interface Point {
  type: GeometryTypes.POINT;
  coordRefSys?: CoordRefSys;
  coordinates: Position;
}

export interface MultiPoint {
  type: GeometryTypes.MULTIPOINT;
  coordRefSys?: CoordRefSys;
  coordinates: Position[];
}

export interface LineString {
  type: GeometryTypes.LINESTRING;
  coordRefSys?: CoordRefSys;
  coordinates: Position[];
}

export interface MultiLineString {
  type: GeometryTypes.MULTILINESTRING;
  coordRefSys?: CoordRefSys;
  coordinates: Position[][];
}

export interface Polygon {
  type: GeometryTypes.POLYGON;
  coordRefSys?: CoordRefSys;
  coordinates: Position[][];
}

export interface MultiPolygon {
  type: GeometryTypes.MULTIPOLYGON;
  coordRefSys?: CoordRefSys;
  coordinates: Position[][][];
}

export interface Polyhedron {
  type: GeometryTypes.POLYHEDRON;
  coordRefSys?: CoordRefSys;
  coordinates: Position3D[][][][];
}

export interface MultiPolyhedron {
  type: GeometryTypes.MULTIPOLYHEDRON;
  coordRefSys?: CoordRefSys;
  coordinates: Position3D[][][][][];
}

export interface Prism {
  type: GeometryTypes.PRISM;
  coordRefSys?: CoordRefSys;
  base: Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon;
  lower?: number;
  upper: number;
}

export interface MultiPrism {
  type: GeometryTypes.MULTIPRISM;
  coordRefSys?: CoordRefSys;
  prisms: Prism[];
}

export interface GeometryCollection {
  type: GeometryTypes.GEOMETRYCOLLECTION;
  coordRefSys?: CoordRefSys;
  geometries: (Point | MultiPoint | LineString | MultiLineString | Polygon | MultiPolygon)[];
}
