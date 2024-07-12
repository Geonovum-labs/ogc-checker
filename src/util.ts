import { IFunctionResult } from '@stoplight/spectral-core';
import mergeAllOf from 'json-schema-merge-allof';
import { OpenAPIV3_0 } from './openapi-types';

export const groupBy = <T>(arr: T[], key: (i: T) => string) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<string, T[]>);

export const handleResponse = (response: Response, uri: string) => {
  if (response.status !== 200) {
    return Promise.reject(`Error while fetching URI \`${uri}\` (status code \`${response.status}\`).`);
  }

  return response.text();
};

export const handleResponseJson = (response: Response, uri: string) => {
  if (response.status !== 200) {
    return Promise.reject(`Error while fetching URI \`${uri}\` (status code \`${response.status}\`).`);
  }

  return response.json();
};

export const errorMessage = (message: string, path?: (string | number)[]): IFunctionResult[] => [{ message, path }];

export const errorStr = (error: string, path: string[]) =>
  path.length > 0 ? `${error} (schema path: "${path.map(error => error.replace('/', '\\/')).join('/')}")` : error;

/**
 * This function recursively matches a schema with a given reference schema.
 *
 * - Equality of schema types & formats
 * - Presence of required properties for object schemas
 *
 * @param schema    The schema
 * @param refSchema The reference schema
 * @returns An array of error messages
 */
export const matchSchema = (
  schema: OpenAPIV3_0.SchemaObject,
  refSchema: OpenAPIV3_0.SchemaObject,
  path: string[] = []
): string[] => {
  const errors: string[] = [];

  if (schema.allOf || refSchema.allOf) {
    // TODO: Handle situations where merged JSON schema is not compatible with OpenAPI 3.0 schema object (e.g. multiple types)
    return matchSchema(
      schema.allOf ? (mergeAllOf(schema.allOf) as OpenAPIV3_0.SchemaObject) : schema,
      refSchema.allOf ? (mergeAllOf(refSchema.allOf) as OpenAPIV3_0.SchemaObject) : refSchema
    );
  }

  if (refSchema.type && schema.type !== refSchema.type) {
    errors.push(errorStr(`Schema type must be "${refSchema.type}".`, path));
  }

  if (refSchema.format && schema.format !== refSchema.format) {
    errors.push(errorStr(`Schema format must be "${refSchema.format}".`, path));
  }

  if (refSchema.type === 'object' && schema.type === 'object') {
    refSchema.required?.forEach(req => {
      if (!schema.required?.includes(req)) {
        errors.push(errorStr(`Property "${req}" must be required.`, path));
      }
    });

    Object.entries(refSchema.properties ?? {}).forEach(([propName, refPropSchema]) => {
      const propSchema = (schema.properties ?? {})[propName];

      if (!propSchema && refSchema.required?.includes(propName)) {
        errors.push(errorStr(`Required property "${propName}" is missing.`, path));
      }

      if (propSchema) {
        matchSchema(propSchema, refPropSchema, [...path, propName]).forEach(error => errors.push(error));
      }
    });
  }

  if (refSchema.type === 'array' && schema.type === 'array') {
    matchSchema(schema.items, refSchema.items, path).forEach(error => errors.push(error));
  }

  return errors;
};
