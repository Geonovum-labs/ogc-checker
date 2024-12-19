import betterAjvErrors from '@stoplight/better-ajv-errors';
import { IFunctionResult, RulesetFunction } from '@stoplight/spectral-core';
import addFormats from 'ajv-formats';
import Ajv, { AnySchemaObject } from 'ajv/dist/2020';

interface Options {
  schema: AnySchemaObject | SchemaFunction;
}

export interface SchemaFunctionResult {
  schema?: AnySchemaObject;
  error?: IFunctionResult;
}

export type SchemaFunction = (input: unknown) => SchemaFunctionResult;

const ajv = new Ajv({
  loadSchema: async uri => {
    const response = await fetch(uri);
    return response.json();
  },
});

addFormats(ajv);

export const remoteSchema: RulesetFunction<unknown, Options> = async (input, options, context) => {
  let schema: AnySchemaObject;

  if (typeof options.schema === 'function') {
    const result = options.schema(input);

    if (result.error) {
      return [result.error];
    } else if (result.schema) {
      schema = result.schema;
    } else {
      throw new Error('Schema function did not result in a schema or errors.');
    }
  } else {
    schema = options.schema;
  }

  return ajv.compileAsync(schema).then(validate => {
    validate(input);

    if (validate.errors) {
      return betterAjvErrors(schema, validate.errors, {
        propertyPath: context.path,
        targetValue: input,
      }).map(({ suggestion, error, path: errorPath }) => ({
        message: suggestion !== void 0 ? `${error}. ${suggestion}` : error,
        path: [...context.path, ...(errorPath !== '' ? errorPath.replace(/^\//, '').split('/') : [])],
      }));
    }
  });
};

export default remoteSchema;
