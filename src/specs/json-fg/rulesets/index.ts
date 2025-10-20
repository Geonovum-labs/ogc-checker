import { Rulesets } from '../../../spectral';
import core, { JSON_FG_CORE_URI } from './core';
import jsonFgPolyhedra, { JSON_FG_POLYHEDRA_URI } from './polyhedra';
import typesSchemas, { JSON_FG_TYPES_SCHEMAS_URI } from './types-schemas';

const rulesets: Rulesets = {
  [JSON_FG_CORE_URI]: core,
  [JSON_FG_POLYHEDRA_URI]: jsonFgPolyhedra,
  [JSON_FG_TYPES_SCHEMAS_URI]: typesSchemas,
};

export default rulesets;
