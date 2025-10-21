import type { RulesetDefinition } from '@stoplight/spectral-core';
import { falsy } from '@stoplight/spectral-functions';
import { DateTime } from 'luxon';
import { hasPositionRange } from '../functions/hasPositionRange';
import { hasSameDimensions } from '../functions/hasSameDimensions';
import { isPlaceAndGeometryNotEqual } from '../functions/isPlaceAndGeometryNotEqual';
import { isValidPlaceCrs } from '../functions/isValidPlaceCrs';
import { remoteSchema, isValidDate, isValidDateTime } from '@geonovum/standards-checker';

export const JSON_FG_CORE_URI = 'http://www.opengis.net/spec/json-fg-1/0.3/conf/core';

export const JSON_FG_CORE_DOC_URI = 'https://docs.ogc.org/DRAFTS/21-045.html#core_';

const isUnbounded = (input: unknown) => typeof input === 'string' && input === '..';

const core: RulesetDefinition = {
  documentationUrl: 'http://www.opengis.net/spec/json-fg-1/0.3/req/core',
  description: 'OGC Features and Geometries JSON - Part 1: Core - Requirements Class "Core"',
  rules: {
    '/req/core/schema-valid': {
      given: '$',
      message: 'The JSON object SHALL validate against the JSON Schema of a JSON-FG root object. {{error}}.',
      documentationUrl: JSON_FG_CORE_DOC_URI + 'schema-valid',
      severity: 'error',
      then: [
        {
          function: remoteSchema,
          functionOptions: {
            schema: {
              type: 'object',
              discriminator: { propertyName: 'type' },
              required: ['conformsTo'],
              properties: {
                conformsTo: { $ref: 'https://beta.schemas.opengis.net/json-fg/conformsto.json' },
              },
              oneOf: [
                { $ref: 'https://beta.schemas.opengis.net/json-fg/feature.json' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/featurecollection.json' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/Point' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/MultiPoint' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/LineString' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/MultiLineString' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/Polygon' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/MultiPolygon' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/GeometryCollection' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/Polyhedron' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/MultiPolyhedron' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/Prism' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/MultiPrism' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/CircularString' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/CompoundCurve' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/CurvePolygon' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/MultiCurve' },
                { $ref: 'https://beta.schemas.opengis.net/json-fg/geometry-object.json#/$defs/MultiSurface' },
              ],
            },
          },
        },
      ],
    },
    '/req/core/metadata#C': {
      given: '$.features.*',
      message: 'Only the root object of the JSON document SHALL include a "conformsTo" member.',
      documentationUrl: JSON_FG_CORE_DOC_URI + 'metadata',
      severity: 'error',
      then: {
        field: 'conformsTo',
        function: falsy,
      },
    },
    // TODO Remove once https://github.com/opengeospatial/ogc-feat-geo-json/issues/151 is fixed
    '/req/core/interval#B': {
      given: '$..time.interval',
      documentationUrl: JSON_FG_CORE_DOC_URI + 'interval',
      severity: 'error',
      then: {
        function: input => {
          if (!Array.isArray(input) || !isValidDate(input[0])) {
            return;
          }

          if (!isValidDate(input[1]) && !isUnbounded(input[1])) {
            return [
              {
                message: 'If the start is a date, the end SHALL be a date, too, or "..".',
              },
            ];
          }
        },
      },
    },
    // TODO Remove once https://github.com/opengeospatial/ogc-feat-geo-json/issues/151 is fixed
    '/req/core/interval#C': {
      given: '$..time.interval',
      documentationUrl: JSON_FG_CORE_DOC_URI + 'interval',
      severity: 'error',
      then: {
        function: input => {
          if (!Array.isArray(input) || !isValidDateTime(input[0])) {
            return;
          }

          if (!isValidDateTime(input[1]) && !isUnbounded(input[1])) {
            return [
              {
                message: 'If the start is a timestamp, the end SHALL be a timestamp, too, or "..".',
              },
            ];
          }
        },
      },
    },
    '/req/core/interval#D': {
      given: '$..time.interval',
      documentationUrl: JSON_FG_CORE_DOC_URI + 'interval',
      severity: 'error',
      then: {
        function: input => {
          if (
            !Array.isArray(input) ||
            (!isValidDate(input[0]) && !isValidDateTime(input[0])) ||
            (!isValidDate(input[1]) && !isValidDateTime(input[1]))
          ) {
            return;
          }

          const intervalStart = DateTime.fromISO(input[0]);
          const intervalEnd = DateTime.fromISO(input[1]);

          if (intervalStart > intervalEnd) {
            return [
              {
                message: 'If neither the start and the end are "..", the start SHALL be earlier than or equal to the end.',
              },
            ];
          }
        },
      },
    },
    '/req/core/instant-and-interval#A': {
      given: '$..time',
      documentationUrl: JSON_FG_CORE_DOC_URI + 'instant-and-interval',
      severity: 'error',
      then: {
        function: input => {
          if (
            !(input && typeof input === 'object') ||
            !('date' in input && isValidDate(input.date)) ||
            !('timestamp' in input && isValidDateTime(input.timestamp))
          ) {
            return;
          }

          const { date, timestamp } = input;

          if (!timestamp.startsWith(date)) {
            return [
              {
                message:
                  'If the "time" value in any JSON-FG feature includes both a "date" and a "timestamp" member, the full-date parts SHALL be identical.',
              },
            ];
          }
        },
      },
    },
    '/req/core/instant-and-interval#B': {
      given: '$..time',
      documentationUrl: JSON_FG_CORE_DOC_URI + 'instant-and-interval',
      severity: 'error',
      then: {
        function: (input: unknown) => {
          if (
            !(input && typeof input === 'object') ||
            !('timestamp' in input && isValidDateTime(input.timestamp)) ||
            !(
              'interval' in input &&
              Array.isArray(input.interval) &&
              isValidDate(input.interval[0]) &&
              (isValidDate(input.interval[1]) || isUnbounded(input.interval[1]))
            )
          ) {
            return;
          }

          const timestamp = DateTime.fromISO(input.timestamp as string);
          const intervalStart = DateTime.fromISO(input.interval[0]);
          const intervalEnd = isValidDate(input.interval[1]) ? DateTime.fromISO(input.interval[1]).endOf('day') : undefined;

          if (timestamp < intervalStart || (intervalEnd && timestamp > intervalEnd)) {
            return [
              {
                message:
                  'If the "time" value in any JSON-FG feature includes both a "timestamp" and an "interval" member with start/end dates, the interval SHALL contain the date of the timestamp, or in case start and end of the interval are identical, the date of the timestamp SHALL be identical to the date of both interval ends.',
              },
            ];
          }
        },
      },
    },
    '/req/core/instant-and-interval#C': {
      given: '$..time',
      documentationUrl: JSON_FG_CORE_DOC_URI + 'instant-and-interval',
      severity: 'error',
      then: {
        function: (input: unknown) => {
          if (
            !(input && typeof input === 'object') ||
            !('timestamp' in input && isValidDateTime(input.timestamp)) ||
            !(
              'interval' in input &&
              Array.isArray(input.interval) &&
              isValidDateTime(input.interval[0]) &&
              (isValidDateTime(input.interval[1]) || isUnbounded(input.interval[1]))
            )
          ) {
            return;
          }

          const timestamp = DateTime.fromISO(input.timestamp as string);
          const intervalStart = DateTime.fromISO(input.interval[0]);
          const intervalEnd = isValidDate(input.interval[1]) ? DateTime.fromISO(input.interval[1]) : undefined;

          if (timestamp < intervalStart || (intervalEnd && timestamp > intervalEnd)) {
            return [
              {
                message:
                  'If the "time" value in any JSON-FG feature includes both a "timestamp" and an "interval" member with start/end timestamps, the interval SHALL contain the timestamp, or in case start and end of the interval are identical, the timestamp SHALL be identical to both interval ends.',
              },
            ];
          }
        },
      },
    },
    '/req/core/instant-and-interval#D': {
      given: '$..time',
      documentationUrl: JSON_FG_CORE_DOC_URI + 'instant-and-interval',
      severity: 'error',
      then: {
        function: (input: unknown) => {
          if (
            !(input && typeof input === 'object') ||
            !('date' in input && isValidDate(input.date)) ||
            !(
              'interval' in input &&
              Array.isArray(input.interval) &&
              isValidDate(input.interval[0]) &&
              (isValidDate(input.interval[1]) || isUnbounded(input.interval[1]))
            )
          ) {
            return;
          }

          const date = DateTime.fromISO(input.date as string);
          const intervalStart = DateTime.fromISO(input.interval[0]);
          const intervalEnd = isValidDate(input.interval[1]) ? DateTime.fromISO(input.interval[1]).endOf('day') : undefined;

          if (date < intervalStart || (intervalEnd && date > intervalEnd)) {
            return [
              {
                message:
                  'If the "time" value in any JSON-FG feature includes both a "date" and an "interval" member with start/end dates, the interval SHALL contain the date, or in case start and end of the interval are identical, the date SHALL be identical to both interval ends.',
              },
            ];
          }
        },
      },
    },
    '/req/core/instant-and-interval#E': {
      given: '$..time',
      documentationUrl: JSON_FG_CORE_DOC_URI + 'instant-and-interval',
      severity: 'error',
      then: {
        function: (input: unknown) => {
          if (
            !(input && typeof input === 'object') ||
            !('date' in input && isValidDate(input.date)) ||
            !(
              'interval' in input &&
              Array.isArray(input.interval) &&
              isValidDateTime(input.interval[0]) &&
              (isValidDateTime(input.interval[1]) || isUnbounded(input.interval[1]))
            )
          ) {
            return;
          }

          const date = DateTime.fromISO(input.date as string);
          const intervalStart = DateTime.fromISO(input.interval[0]).startOf('day');
          const intervalEnd = isValidDateTime(input.interval[1]) ? DateTime.fromISO(input.interval[1]).startOf('day') : undefined;

          if (date < intervalStart || (intervalEnd && date > intervalEnd)) {
            return [
              {
                message:
                  'If the "time" value in any JSON-FG feature includes both a "date" and an "interval" member with start/end timestamps, the interval SHALL include timestamps on the date, or in case start and end of the interval are identical, the date SHALL be identical to the date of both interval ends.',
              },
            ];
          }
        },
      },
    },
    '/req/core/coordinate-dimension': {
      given: ['$..geometry', '$..place', '$..place..base'],
      documentationUrl: JSON_FG_CORE_DOC_URI + 'coordinate-dimension',
      severity: 'error',
      then: {
        function: hasSameDimensions,
      },
    },
    '/req/core/geometry-wgs84': {
      given: '$..geometry',
      documentationUrl: JSON_FG_CORE_DOC_URI + 'geometry-wgs84',
      severity: 'error',
      then: {
        function: hasPositionRange,
        functionOptions: { x: [-180, 180], y: [-90, 90] },
      },
    },
    '/req/core/place': {
      given: '$..place',
      documentationUrl: JSON_FG_CORE_DOC_URI + 'place',
      severity: 'error',
      then: {
        function: isValidPlaceCrs,
      },
    },
    '/req/core/fallback': {
      given: '$',
      documentationUrl: JSON_FG_CORE_DOC_URI + 'fallback',
      severity: 'error',
      then: {
        function: isPlaceAndGeometryNotEqual,
      },
    },
  },
};

export default core;