import { Rulesets } from '@geonovum/standards-checker';
import featuresCore, { OGC_API_FEATURES_CORE_URI } from './features-core';
import featuresCrs, { OGC_API_FEATURES_CRS_URI } from './features-crs';
import featuresGeoJson, { OGC_API_FEATURES_GEOJSON_URI } from './features-geojson';
import featuresOas30, { OGC_API_FEATURES_OAS30_URI } from './features-oas30';
import processesCore, { OGC_API_PROCESSES_CORE_URI } from './processes-core';
import processesJobList, { OGC_API_PROCESSES_JOB_LIST_URI } from './processes-job-list';
import processesJson, { OGC_API_PROCESSES_JSON_URI } from './processes-json';
import processOgcProcessDescription, { OGC_API_PROCESSES_OGC_PROCESS_DESCRIPTION_URI } from './processes-ogc-process-description';
import recordsJson, { OGC_API_RECORDS_JSON_URI } from './records-json';

const rulesets: Rulesets = {
  // Features - Part 1
  [OGC_API_FEATURES_CORE_URI]: featuresCore,
  [OGC_API_FEATURES_OAS30_URI]: featuresOas30,
  [OGC_API_FEATURES_GEOJSON_URI]: featuresGeoJson,
  // Features - Part 2
  [OGC_API_FEATURES_CRS_URI]: featuresCrs,
  // Processes - Part 1
  [OGC_API_PROCESSES_CORE_URI]: processesCore,
  [OGC_API_PROCESSES_JOB_LIST_URI]: processesJobList,
  [OGC_API_PROCESSES_JSON_URI]: processesJson,
  [OGC_API_PROCESSES_OGC_PROCESS_DESCRIPTION_URI]: processOgcProcessDescription,
  // Records - Part 1
  [OGC_API_RECORDS_JSON_URI]: recordsJson,
};

export default rulesets;
