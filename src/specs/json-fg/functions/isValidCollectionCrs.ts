import { RulesetFunction } from '@stoplight/spectral-core';
import { GeometryTypes } from 'standards-checker';
import { errorMessage } from 'standards-checker/engine/util';

const containsCrs = (item: unknown) => item && typeof item === 'object' && 'coordRefSys' in item;

const collectionContainsCrs = (input: unknown) =>
  input &&
  typeof input === 'object' &&
  'type' in input &&
  input.type === GeometryTypes.GEOMETRYCOLLECTION &&
  'geometries' in input &&
  Array.isArray(input.geometries) &&
  input.geometries.some(geometry => containsCrs(geometry));

const prismBaseContainsCrs = (input: unknown) =>
  input && typeof input === 'object' && 'type' in input && input.type === GeometryTypes.PRISM && 'base' in input && containsCrs(input.base);

const multiPrismMemberContainsCrs = (input: unknown) =>
  input &&
  typeof input === 'object' &&
  'type' in input &&
  input.type === GeometryTypes.MULTIPRISM &&
  'prisms' in input &&
  Array.isArray(input.prisms) &&
  input.prisms.some(prism => containsCrs(prism));

const multiPrismMemberBaseContainsCrs = (input: unknown) =>
  input &&
  typeof input === 'object' &&
  'type' in input &&
  input.type === GeometryTypes.MULTIPRISM &&
  'prisms' in input &&
  Array.isArray(input.prisms) &&
  input.prisms.some(prism => prismBaseContainsCrs(prism));

export const isValidCollectionCrs: RulesetFunction<unknown> = async input => {
  if (
    collectionContainsCrs(input) ||
    prismBaseContainsCrs(input) ||
    multiPrismMemberContainsCrs(input) ||
    multiPrismMemberBaseContainsCrs(input)
  ) {
    return errorMessage(
      'If the "place" member in any JSON-FG feature in the JSON document is not null and the geometry type (member ' +
        '"type") is "GeometryCollection" or any other geometry type that has embedded geometry objects, no embedded ' +
        'geometry object SHALL include a "coordRefSys" member.'
    );
  }
};
