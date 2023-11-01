# json-fg-linter

## Rules
Based on JSON-FG requirements classes [Core](https://docs.ogc.org/DRAFTS/21-045.html#rc_core), [3D](https://docs.ogc.org/DRAFTS/21-045.html#rc_3d) and [Features types and Schemas](https://docs.ogc.org/DRAFTS/21-045.html#rc_types-schemas) plus: 

conformsTo (can be HTTP URI or Safe CURIE):
- Core - must always be set
- 3D - warning, if neither Polyhedron, MultiPolyhedron, Prism, nor MultiPrism is used
- Feature Types and Schemas - warning, if "featureType" is not used

Geometries:
- validate all GeoJSON geometries including embedded ones in a Prism using a library that supports Simple Features validation
- validation of Polyhedron geometries needs to test that each shell is a composite and closed; voids must be in the outer shell
- coordinate dimension is consistent with the CRS (should maybe a requirement in Core, too)
﻿
