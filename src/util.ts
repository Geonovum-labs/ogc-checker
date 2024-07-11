import { OpenAPIV3_0 } from './openapi-types';

export const groupBy = <T>(arr: T[], key: (i: T) => string) =>
  arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<string, T[]>);

export const errorMessage = (message: string) => [
  {
    message: message,
  },
];

/**
 * This function recursively matches a schema with a given reference schema.
 *
 * - Equality of schema types
 * - Presence of required properties for object schemas
 *
 * @param schema    The schema
 * @param refSchema The reference schema
 * @returns An array of error messages
 */
export const matchSchema = (schema: OpenAPIV3_0.SchemaObject, refSchema: OpenAPIV3_0.SchemaObject): string[] => {
  const errors: string[] = [];

  if (refSchema.type && schema.type !== refSchema.type) {
    errors.push(`Schema type must be "${refSchema.type}".`);
  }

  if (refSchema.type === 'object' && schema.type === 'object') {
    refSchema.required?.forEach(req => {
      if (!schema.required?.includes(req)) {
        errors.push(`Property "${req}" must be required.`);
      }
    });

    Object.entries(refSchema.properties ?? {}).forEach(([refPropName, refPropSchema]) => {
      const propSchema = (schema.properties ?? {})[refPropName];

      if (!propSchema && refSchema.required?.includes(refPropName)) {
        errors.push(`Required property "${refPropName}" is missing.`);
      }

      if (propSchema) {
        matchSchema(propSchema, refPropSchema).forEach(error => errors.push(error));
      }
    });
  }

  if (refSchema.type === 'array' && schema.type === 'array') {
    matchSchema(schema.items, refSchema.items).forEach(error => errors.push(error));
  }

  return errors;
};
