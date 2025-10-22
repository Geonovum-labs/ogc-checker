import { Rulesets } from '../../../spectral';
import api, { JSON_FG_API_URI } from './api';
import circularArcs, { JSON_FG_CIRCULAR_ARCS_URI } from './circular-arcs';
import core, { JSON_FG_CORE_URI } from './core';
import measures, { JSON_FG_MEASURES_URI } from './measures';
import polyhedra, { JSON_FG_POLYHEDRA_URI } from './polyhedra';
import prisms, { JSON_FG_PRISMS_URI } from './prisms';
import profiles, { JSON_FG_PROFILES_URI } from './profiles';
import typesSchemas, { JSON_FG_TYPES_SCHEMAS_URI } from './types-schemas';

const rulesets: Rulesets = {
  [JSON_FG_CORE_URI]: core,
  [JSON_FG_POLYHEDRA_URI]: polyhedra,
  [JSON_FG_PRISMS_URI]: prisms,
  [JSON_FG_CIRCULAR_ARCS_URI]: circularArcs,
  [JSON_FG_MEASURES_URI]: measures,
  [JSON_FG_TYPES_SCHEMAS_URI]: typesSchemas,
  [JSON_FG_PROFILES_URI]: profiles,
  [JSON_FG_API_URI]: api,
};

export default rulesets;
