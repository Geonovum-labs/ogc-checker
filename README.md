# Geonovum OGC Checker

This repository contains a checker (validation & linting) for [OGC API Standards](https://ogcapi.ogc.org/) and [OGC Features and Geometries JSON (JSON-FG): Part 1 Core](https://docs.ogc.org/DRAFTS/21-045.html).

URL: https://geonovum.github.io/ogc-checker/

## JSON-FG

The validation rules are based on JSON-FG requirements classes [Core](https://docs.ogc.org/DRAFTS/21-045.html#rc_core), [3D](https://docs.ogc.org/DRAFTS/21-045.html#rc_3d) and [Features types and Schemas](https://docs.ogc.org/DRAFTS/21-045.html#rc_types-schemas). In addition, the checker does some consistency checks that are useful but not based on explicit requirements.

The following table gives an overview of supported JSON-FG requirements. The codes in the Rules column are the
requirement names as listed in the OGC standard document. The table mentions separate sub requirements (e.g. "A", "B") only when some are and some are not supported.

| Requirement                               | Tested | Description                                                                                                   |
| ----------------------------------------- | :----: | ------------------------------------------------------------------------------------------------------------- |
| Correct JSON syntax                       |  Yes   | Basis syntax checking                                                                                         |
| /req/core/schema-valid                    |  Yes   | JSON Schema validation                                                                                        |
| /rec/core/properties                      |   No   | GeoJSON compatibility mode ([open discussion](https://github.com/opengeospatial/ogc-feat-geo-json/issues/82)) |
| /req/core/metadata                        |  Yes   | Presence of conformance statement                                                                             |
| /req/core/instant                         |  Yes   | Valid dates / times in instants                                                                               |
| /req/core/interval                        |  Yes   | Valid dates / times in intervals                                                                              |
| /req/core/instant-and-interval            |  Yes   | Consistancy between instant and interval                                                                      |
| interval start is before interval end     |  Yes   | This is checked in addition to the official requirements                                                      |
| /req/core/utc                             |  Yes   | Always UTC ("Z") timezone                                                                                     |
| /req/core/coordinate-dimension            |  Yes   | All positions in a geometry have the same dimension                                                           |
| /req/core/geometry-wgs84                  |  Yes   | WGS84 geometries within range                                                                                 |
| /req/core/geom-valid                      |   No   | Validity of geometries                                                                                        |
| /req/core/place                           |  Yes   | No valid GeoJSON geometries in `place`                                                                        |
| /req/core/geometry-collection             |  Yes   | All coordinates in a collection have the same CRS                                                             |
| /req/core/fallback - A                    |  Yes   | Geometries in `geometry` and `place` are not the same                                                         |
| /req/core/fallback - B                    |   No   | GeoJSON compatibility is indicated in when the document is a GET response                                     |
| /req/core/axis-order                      |   No   | Conformance to OGC axis order policy                                                                          |
| /rec/core/place-crs                       |   No   | Coordinates in `place` within range of the used CRS                                                           |
| /req/3d/metadata                          |  Yes   | Presence of conformance statement for 3D geometries                                                           |
| /req/3d/coordinate-dimension              |  Yes   | All positions in a 3D geometry have 3 dimensions                                                              |
| /req/3d/geom-valid                        |   No   | Valid 3D geometries                                                                                           |
| /req/types-schemas/metadata               |  Yes   | Presence of metadata conformance statement                                                                    |
| /req/types-schemas/feature-type           |  Yes   | Presence of `featureType`                                                                                     |
| /req/types-schemas/geometry-dimension     |  Yes   | Consistency between `geometryDimension` and geometry type                                                     |
| /rec/types-schemas/homogeneous-collection |   No   | `featureType` and `geometryDimension` stated on collection level when all are the same                        |
| /req/types-schemas/feature-schemas        |   No   | Referenced schemas must conform to OGC API Features part 5: Schemas                                           |
| /req/types-schemas/single-feature-schema  |   No   | Consistency between feature schema and feature type                                                           |

## OGC API - Features - Part 1: Core

Version: 1.0.1\
Specification: https://docs.ogc.org/is/17-069r4/17-069r4.html

| Requirement                     | Testable | Tested | Remarks |
| ------------------------------- | :------: | :----: | ------- |
| `/req/core/root-op`             |   Yes    |  Yes   |         |
| `/req/core/root-success`        |   Yes    |  Yes   |         |
| `/req/core/conformance-op`      |   Yes    |  Yes   |         |
| `/req/core/conformance-success` |   Yes    |  Yes   |         |
| `/req/core/fc-md-op`            |   Yes    |  Yes   |         |
| `/req/core/fc-md-success`       |   Yes    |  Yes   |         |
| `/req/core/sfc-md-op`           |   Yes    |  Yes   |         |
| `/req/core/sfc-md-success`      |   Yes    |  Yes   |         |
| `/req/core/fc-op`               |   Yes    |  Yes   |         |
| `/req/core/fc-response`         |   Yes    |  Yes   |         |
| `/req/core/fc-limit-definition` |   Yes    |  Yes   |         |
| `/req/core/fc-bbox-definition`  |   Yes    |  Yes   |         |
| `/req/core/fc-time-definition`  |   Yes    |  Yes   |         |
| `/req/core/f-op`                |   Yes    |  Yes   |         |
| `/req/core/f-response`          |   Yes    |  Yes   |         |
| `/req/oas30/oas-definition-2`   |   Yes    |  Yes   |         |

## OGC API - Features - Part 2: Coordinate Reference Systems by Reference

Version: 1.0.1\
Specification: https://docs.ogc.org/is/18-058r1/18-058r1.html

| Requirement                               | Testable | Tested | Remarks                                       |
| ----------------------------------------- | :------: | :----: | --------------------------------------------- |
| `/req/crs/crs-uri`                        |    No    |   No   |                                               |
| `/req/crs/fc-md-crs-list`                 |   Yes    |  Yes   |                                               |
| `/req/crs/fc-md-storageCrs`               |    No    |   No   |                                               |
| `/req/crs/fc-md-storageCrs-valid-value`   |   Yes    |  Yes   |                                               |
| `/req/crs/fc-md-crs-list-global`          |    No    |   No   |                                               |
| `/req/crs/fc-bbox-crs-definition`         |   Yes    |  Yes   |                                               |
| `/req/crs/fc-bbox-crs-valid-value`        |   Yes    |  Yes   | Tests the presence of a 400 response.         |
| `/req/crs/fc-bbox-crs-valid-defaultValue` |   Yes    |  Yes   | Covered by `/req/crs/fc-bbox-crs-definition`. |
| `/req/crs/fc-bbox-crs-action`             |    No    |   No   |                                               |
| `/req/crs/fc-crs-definition`              |   Yes    |  Yes   |                                               |
| `/req/crs/fc-crs-valid-value`             |    No    |   No   |                                               |
| `/req/crs/fc-crs-default-value`           |   Yes    |  Yes   | Covered by `/req/crs/fc-crs-definition`.      |
| `/req/crs/fc-crs-action`                  |    No    |   No   |                                               |
| `/req/crs/geojson`                        |    No    |   No   |                                               |
| `/req/crs/ogc-crs-header`                 |   Yes    |  Yes   |                                               |
| `/req/crs/ogc-crs-header-value`           |    No    |   No   |                                               |

## OGC API - Processes - Part 1: Core

Version: 2.0 (Draft)\
Specification: https://docs.ogc.org/DRAFTS/18-062r3.html

| Requirement                                                     | Testable | Tested | Remarks |
| --------------------------------------------------------------- | :------: | :----: | ------- |
| `/req/core/landingpage-op`                                      |   Yes    |  Yes   |         |
| `/req/core/landingpage-success`                                 |   Yes    |  Yes   |         |
| `/req/core/api-definition-op`                                   |    No    |   No   |         |
| `/req/core/api-definition-success`                              |    No    |   No   |         |
| `/req/core/conformance-op`                                      |   Yes    |  Yes   |         |
| `/req/core/conformance-success`                                 |   Yes    |  Yes   |         |
| `/req/core/http`                                                |    No    |   No   |         |
| `/req/core/process-list`                                        |   Yes    |  Yes   |         |
| `/req/core/pl-limit-definition`                                 |   Yes    |  Yes   |         |
| `/req/core/pl-limit-response`                                   |    No    |   No   |         |
| `/req/core/process-list-success`                                |   Yes    |  Yes   |         |
| `/req/core/pl-links`                                            |    No    |   No   |         |
| `/req/core/process-summary-links`                               |    No    |   No   |         |
| `/req/core/process-description`                                 |   Yes    |  Yes   |         |
| `/req/core/process-description-success`                         |   Yes    |  Yes   |         |
| `/req/core/process-exception/no-such-process`                   |   Yes    |  Yes   |         |
| `/req/core/process-execute-op`                                  |   Yes    |  Yes   |         |
| `/req/core/process-execute-request`                             |   Yes    |  Yes   |         |
| `/req/core/process-execute-inputs`                              |    ?     |   No   |         |
| `/req/core/process-execute-input-array`                         |    ?     |   No   |         |
| `/req/core/process-execute-input-inline-object`                 |    ?     |   No   |         |
| `/req/core/process-execute-input-mixed-type`                    |    ?     |   No   |         |
| `/req/core/process-execute-input-inline-binary`                 |    ?     |   No   |         |
| `/req/core/process-execute-input-inline-bbox`                   |    ?     |   No   |         |
| `/req/core/process-execute-input-validation`                    |    ?     |   No   |         |
| `/req/core/process-execute-default-execution-mode`              |    ?     |   No   |         |
| `/req/core/process-execute-auto-execution-mode`                 |    ?     |   No   |         |
| `/req/core/process-execute-default-outputs`                     |    ?     |   No   |         |
| `/req/core/process-execute-sync-raw-value-one`                  |    ?     |   No   |         |
| `/req/core/process-execute-sync-raw-value-multi`                |    ?     |   No   |         |
| `/req/core/process-execute-sync-raw-ref`                        |    ?     |   No   |         |
| `/req/core/process-execute-sync-raw-mixed-multi`                |    ?     |   No   |         |
| `/req/core/process-execute-sync-document`                       |    ?     |   No   |         |
| `/req/core/process-execute-sync-document-ref`                   |    ?     |   No   |         |
| `/req/core/process-execute-sync-job`                            |    ?     |   No   |         |
| `/req/core/job-results-success-sync`                            |    No    |   No   |         |
| `/req/core/process-execute-success-async`                       |   Yes    |   No   |         |
| `/req/core/job`                                                 |   Yes    |   No   |         |
| `/req/core/job-success`                                         |   Yes    |   No   |         |
| `/req/core/job-exception-no-such-job`                           |   Yes    |   No   |         |
| `/req/core/job-result`                                          |   Yes    |   No   |         |
| `/req/core/job-results`                                         |   Yes    |   No   |         |
| `/req/core/job-results-param-outputs`                           |   Yes    |   No   |         |
| `/req/core/job-results-param-outputs-response`                  |    No    |   No   |         |
| `/req/core/job-results-param-outputs-omit`                      |    No    |   No   |         |
| `/req/core/job-results-param-outputs-empty`                     |   Yes    |   No   |         |
| `/req/core/job-results-async-one`                               |   Yes    |   No   |         |
| `/req/core/job-results-async-many`                              |   Yes    |   No   |         |
| `/req/core/job-results-exception/invalid-query-parameter-value` |   Yes    |   No   |         |
| `/req/core/job-results-exception/no-such-job`                   |   Yes    |   No   |         |
| `/req/core/job-results-exception/results-not-ready`             |   Yes    |   No   |         |
| `/req/core/job-results-failed`                                  |   Yes    |   No   |         |
| `/req/ogc-process-description/json-encoding`                    |   Yes    |  Yes   |         |
| `/req/ogc-process-description/links`                            |    No    |   No   |         |
| `/req/ogc-process-description/inputs-def`                       |    ?     |   No   |         |
| `/req/ogc-process-description/input-def`                        |    ?     |   No   |         |
| `/req/ogc-process-description/input-binary`                     |    ?     |   No   |         |
| `/req/ogc-process-description/input-mixed-type`                 |    ?     |   No   |         |
| `/req/ogc-process-description/outputs-def`                      |    ?     |   No   |         |
| `/req/ogc-process-description/output-def`                       |    ?     |   No   |         |
| `/req/ogc-process-description/output-mixed-type`                |    ?     |   No   |         |
| `/req/job-list/job-list-op`                                     |   Yes    |  Yes   |         |
| `/rec/job-list/job-list-landing-page`                           |    No    |   No   |         |
| `/req/job-list/type-definition`                                 |   Yes    |  Yes   |         |
| `/req/job-list/type-response`                                   |    No    |   No   |         |
| `/req/job-list/processID-mandatory`                             |   Yes    |   No   |         |
| `/req/job-list/processID-definition`                            |   Yes    |  Yes   |         |
| `/req/job-list/processid-response`                              |    No    |   No   |         |
| `/req/job-list/status-definition`                               |   Yes    |  Yes   |         |
| `/req/job-list/status-response`                                 |    No    |   No   |         |
| `/req/job-list/datetime-definition`                             |   Yes    |  Yes   |         |
| `/req/job-list/datetime-response`                               |    No    |   No   |         |
| `/req/job-list/duration-definition`                             |   Yes    |  Yes   |         |
| `/req/job-list/duration-response`                               |    No    |   No   |         |
| `/req/job-list/limit-definition`                                |   Yes    |  Yes   |         |
| `/req/job-list/limit-default-minimum-maximum`                   |   Yes    |  Yes   |         |
| `/req/job-list/limit-response`                                  |    No    |   No   |         |
| `/req/job-list/job-list-success`                                |   Yes    |  Yes   |         |
| `/req/json/definition`                                          |   Yes    |  Yes   |         |

## OGC API - Records - Part 1: Core

Version: 1.0 (Draft)\
Specification: https://docs.ogc.org/DRAFTS/20-004r1.html

| Requirement                        | Testable | Tested | Remarks |
| ---------------------------------- | :------: | :----: | ------- |
| `/req/json/conformance`            |    No    |   No   |         |
| `/req/json/record-response`        |   Yes    |  Yes   |         |
| `/req/json/record-content`         |   Yes    |  Yes   |         |
| `/req/json/record-content-profile` |    No    |   No   |         |
| `/req/json/collection-response`    |   Yes    |  Yes   |         |
| `/req/json/catalog-content`        |   Yes    |  Yes   |         |

## Development

Prepare your local environment:

- Install project dependencies: `npm install`
- Install VSCode extensions: Prettier, ESLint, Tailwind CSS IntelliSense
- Set VSCode default formatter to `esbenp.prettier-vscode`

Start the development server:

```bash
npm run dev
```
