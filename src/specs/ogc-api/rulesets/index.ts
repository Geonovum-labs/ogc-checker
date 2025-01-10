import { Rulesets } from '../../../spectral';
import featuresCore, { OGC_API_FEATURES_CORE_URI } from './features-core';
import featuresGeoJson, { OGC_API_FEATURES_GEOJSON_URI } from './features-geojson';
import featuresOas30, { OGC_API_FEATURES_OAS3_URI } from './features-oas30';

const rulesets: Rulesets = {
  [OGC_API_FEATURES_CORE_URI]: featuresCore,
  [OGC_API_FEATURES_OAS3_URI]: featuresOas30,
  [OGC_API_FEATURES_GEOJSON_URI]: featuresGeoJson,
};

export default rulesets;
