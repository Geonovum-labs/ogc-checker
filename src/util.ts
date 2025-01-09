import { Diagnostic } from '@codemirror/lint';
import { IFunctionResult, RulesetFunctionContext } from '@stoplight/spectral-core';
import mergeAllOf from 'json-schema-merge-allof';
import nimma from 'nimma';
import { last } from 'ramda';
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

export const groupBySource = (diagnostics: Diagnostic[]) => groupBy(diagnostics, d => d.source ?? '');

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

/**
 * This function formats JSON documents.
 *
 * @param content  The raw content to format
 * @returns A formatted document
 */
export const formatDocument = (content: string): string => {
  try {
    const doc = JSON.parse(content);
    return JSON.stringify(doc, undefined, 2);
  } catch {
    throw new Error('JSON document could not be parsed.');
  }
};

export const queryPath = (context: RulesetFunctionContext, path: string): Promise<unknown> => {
  const documentInventory = context.documentInventory;

  if (!('resolved' in documentInventory)) {
    throw new Error('Context does not contain resolved document.');
  }

  const document = documentInventory.resolved;

  return new Promise(resolve => {
    nimma.query(document, {
      [path]: scope => resolve(scope.value),
    });
  });
};

export const getParent = (context: RulesetFunctionContext): unknown => {
  if (context.path.length === 0) {
    return;
  }

  const parentPath = ['$', ...context.path.slice(0, context.path.length - 1)];
  const lastSegment = last(parentPath);

  if (typeof lastSegment === 'number') {
    parentPath.pop();
  }

  return queryPath(context, parentPath.join('.'));
};
