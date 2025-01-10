import { Rulesets } from '../../../spectral';
import featuresCore, { OGC_API_FEATURES_CORE_URI } from './features-core';
import featuresCrs, { OGC_API_FEATURES_CRS_URI } from './features-crs';
import featuresGeoJson, { OGC_API_FEATURES_GEOJSON_URI } from './features-geojson';
import featuresOas30, { OGC_API_FEATURES_OAS3_URI } from './features-oas30';

const rulesets: Rulesets = {
  // Features - Part 1
  [OGC_API_FEATURES_CORE_URI]: featuresCore,
  [OGC_API_FEATURES_OAS3_URI]: featuresOas30,
  [OGC_API_FEATURES_GEOJSON_URI]: featuresGeoJson,
  // Features - Part 2
  [OGC_API_FEATURES_CRS_URI]: featuresCrs,
};

export default rulesets;
