# JSON-FG Linter

This repository contains a linter for [OGC Features and Geometries JSON (JSON-FG): Part 1 Core](https://docs.ogc.org/DRAFTS/21-045.html).

URL: https://geonovum-labs.github.io/json-fg-linter/

## Rules

The linter rules are based on JSON-FG requirements classes [Core](https://docs.ogc.org/DRAFTS/21-045.html#rc_core), [3D](https://docs.ogc.org/DRAFTS/21-045.html#rc_3d) and [Features types and Schemas](https://docs.ogc.org/DRAFTS/21-045.html#rc_types-schemas). In addition, the linter does some consistency checks that are useful but not based on explicit requirements.

The following table gives an overview of supported JSON-FG requirements. The codes in the Rules column are the
requirement names as listed in the OGC standard document. The table mentions separate sub requirements (e.g. "A", "B") only when some are and some are not supported.

| Rule                                      | Supported | Description                                                                            |
| :---------------------------------------- | :-------: | -------------------------------------------------------------------------------------- |
| Correct JSON syntax                       |  **yes**  | Basis syntax checking                                                                  |
| /req/core/schema-valid                    |  **yes**  | JSON Schema validation                                                                 |
| /rec/core/properties                      |    no     | GeoJSON compatibility mode                                                             |
| /req/core/metadata                        |  **yes**  | Presence of conformance statement                                                      |
| /req/core/instant                         |  **yes**  | Valid dates / times in instants                                                        |
| /req/core/interval                        |  **yes**  | Valid dates / times in intervals                                                       |
| /req/core/instant-and-interval            |  **yes**  | Consistancy between instant and interval                                               |
| interval start is before interval end     |  **yes**  | This is checked in addition to the official requirements                               |
| /req/core/utc                             |  **yes**  | Always UTC ("Z") timezone                                                              |
| /req/core/coordinate-dimension            |  **yes**  | All positions in a geometry have the same dimension                                    |
| /req/core/geometry-wgs84                  |  **yes**  | WGS84 geometries within range                                                          |
| /req/core/geom-valid                      |    no     | Validity of geometries                                                                 |
| /req/core/place                           |  **yes**  | No valid GeoJSON geometries in `place`                                                 |
| /req/core/geometry-collection             |  **yes**  | All coordinates in a collection have the same CRS                                      |
| /req/core/fallback - A                    |  **yes**  | Geometries in `geometry` and `place` are not the same                                  |
| /req/core/fallback - B                    |    no     | GeoJSON compatibility is indicated in when the document is a GET response              |
| /req/core/axis-order                      |    no     | Conformance to OGC axis order policy                                                   |
| /rec/core/place-crs                       |    no     | Coordinates in `place` within range of the used CRS                                    |
| /req/3d/metadata                          |  **yes**  | Presence of conformance statement for 3D geometries                                    |
| /req/3d/coordinate-dimension              |  **yes**  | All positions in a 3D geometry have 3 dimensions                                       |
| /req/3d/geom-valid                        |    no     | Valid 3D geometries                                                                    |
| /req/types-schemas/metadata               |  **yes**  | Presence of metadata conformance statement                                             |
| /req/types-schemas/feature-type           |  **yes**  | Presence of `featureType`                                                              |
| /req/types-schemas/geometry-dimension     |  **yes**  | Consistency between `geometryDimension` and geometry type                              |
| /rec/types-schemas/homogeneous-collection |    no     | `featureType` and `geometryDimension` stated on collection level when all are the same |
| /req/types-schemas/feature-schemas        |    no     | Referenced schemas must conform to OGC API Features part 5: Schemas                    |
| /req/types-schemas/single-feature-schema  |    no     | Consistency between feature schema and feature type                                    |
