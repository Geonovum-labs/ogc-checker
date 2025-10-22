import { DocumentTypes } from '../../types';

export const isFeature = (input: unknown) =>
  input && typeof input === 'object' && 'type' in input && typeof input.type === 'string' && input.type === DocumentTypes.FEATURE;

export const isFeatureCollection = (input: unknown) =>
  input && typeof input === 'object' && 'type' in input && typeof input.type === 'string' && input.type === DocumentTypes.FEATURECOLLECTION;

export const isValidCoordinateArray = (value: unknown): boolean =>
  Array.isArray(value) &&
  ((value.every(item => typeof item === 'number') && [2, 3].includes(value.length)) || value.every(item => isValidCoordinateArray(item)));

export const getType = (input: unknown): string | undefined =>
  input && typeof input === 'object' && 'type' in input && typeof input.type === 'string' ? input.type : undefined;

export const getPlaceType = (input: unknown): string | undefined =>
  input && typeof input === 'object' && 'place' in input ? getType(input.place) : undefined;

export const getConformsTo = (input: unknown): string[] =>
  input &&
  typeof input === 'object' &&
  'conformsTo' in input &&
  Array.isArray(input.conformsTo) &&
  input.conformsTo.every(c => typeof c === 'string')
    ? input.conformsTo
    : [];

export const getFeatures = (input: unknown): unknown[] =>
  input && typeof input === 'object' && 'features' in input && Array.isArray(input.features) ? input.features : [];

export const getGeometryDimension = (input: unknown): number | undefined =>
  input && typeof input === 'object' && 'geometryDimension' in input && typeof input.geometryDimension === 'number'
    ? input.geometryDimension
    : undefined;