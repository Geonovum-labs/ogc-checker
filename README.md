# JSON-FG Linter

This repository contains a linter for OGC Features and Geometries JSON (JSON-FG) [Part 1 Core](https://docs.ogc.org/DRAFTS/21-045.html).

## Rules

The linter rules are based on JSON-FG requirements classes [Core](https://docs.ogc.org/DRAFTS/21-045.html#rc_core), [3D](https://docs.ogc.org/DRAFTS/21-045.html#rc_3d) and [Features types and Schemas](https://docs.ogc.org/DRAFTS/21-045.html#rc_types-schemas). In addition, the linter does some consistency checks that are useful but not based on explicit requirements.

In addition to requirements that can be validated with the JSON-FG JSON Schema, the following rules are also implemented. When based on JSON-FG requirements or recommendations this is stated in the list.

### time

- Requirement 4B-C: validate type consistency for "interval" ends.
- Requirement 5A-E: validate consistency between "date", "timestamp" and "interval".
- Validate that interval start is before interval end ([spec issue](https://github.com/opengeospatial/ogc-feat-geo-json/issues/122)).

### conformsTo (can be HTTP URI or Safe CURIE):

- Validate that conformance with Core is stated - this must always be set
- give a warning, if 3D conformance is stated but neither Polyhedron, MultiPolyhedron, Prism, nor MultiPrism is used
- validate that 3D conformance is stated if Polyhedron, MultiPolyhedron, Prism, or MultiPrism geometries are present
- give a warning, if Feature Types and Schemas conformance is stated but "featureType" is not used
- validate that Feature Types and Schemas conformance is stated if "featureType" is present

### all geometries:

- Requirement 7: validate that all coordinates have the same dimension
- Requirement 8A-B: validate that coordinates in the "geometry" member are within WGS84 bounds
- Requirement 9: validate all GeoJSON geometries including embedded ones in a Prism using a library that supports Simple Features validation
- Requirement 10: validate that there are no point, line string or polygon geometries in WGS 84 longitude/latitude in "place"
- Requirement 11: validate that all coordinates within a geometry collection in a "place" member are in the same CRS
- Requirement 12A: if both "geometry" and "place" are not null, validate that their values are not identical
- Requirement 2 give a warning if positions in coordinates are outside the valid range for the CRS
- validate that the coordinate dimension is consistent with the CRS (this is not currently a requirement, but makes sense as an additional test)
- Requirement 10: validate that the geometries are consistent with the stated geometry dimension

### 3D geometries:

- Requirement 15: validate that Polyhedron and MultiPolyhedron geometries have a coordinate dimension of 3.
- Requirement 16: validate for Polyhedron geometries that each shell is a composite and closed; voids must be in the outer shell

### feature types and schemas:

- Recommendation 3a: give a warning if all features in a feature collection have the same feature type and the feature type information is not specified on the collection.
- Recommendation 3b: give a warning if all geometries in a feature collection have the same dimension and geometryDimension is not stated on the collection level.
- Requirement 21: if a single feature schema is referenced, validate that all "featureType" members declare a single feature type and have the same value.
