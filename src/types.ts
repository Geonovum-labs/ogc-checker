import { Extension } from '@uiw/react-codemirror';

export interface Spec {
  name: string;
  slug: string;
  example: string;
  linters: SpecLinter[];
  responseMapper?: SpecResponseMapper;
}

export interface SpecInput {
  content: string;
  linters?: SpecLinter[];
}

export type SpecLinter = {
  name: string;
  linter: Extension;
};

export type SpecResponseMapper = (responseText: string) => Promise<SpecInput>;

export type Severity = 'hint' | 'info' | 'warning' | 'error';

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

export type Position2D = [number, number];

export type Position3D = [number, number, number];

export type Position = Position2D | Position3D;

export type Coordinates = Position | Coordinates[];
