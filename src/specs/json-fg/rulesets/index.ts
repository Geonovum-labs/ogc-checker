import { Rulesets } from 'standards-checker';
import _3d, { JSON_FG_3D_URI } from './3d';
import core, { JSON_FG_CORE_URI } from './core';
import typesSchemas, { JSON_FG_TYPES_SCHEMAS_URI } from './types-schemas';

const rulesets: Rulesets = {
  [JSON_FG_CORE_URI]: core,
  [JSON_FG_3D_URI]: _3d,
  [JSON_FG_TYPES_SCHEMAS_URI]: typesSchemas,
};

export default rulesets;
