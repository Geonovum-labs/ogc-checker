import betterAjvErrors from '@stoplight/better-ajv-errors';
import { RulesetFunction } from '@stoplight/spectral-core';
import addFormats from 'ajv-formats';
import Ajv, { AnySchemaObject } from 'ajv/dist/2020';

const ajv = new Ajv({
  loadSchema: async uri => {
    const response = await fetch(uri);
    return response.json();
  },
});

addFormats(ajv);

interface Options {
  schema: AnySchemaObject;
}

export const remoteSchema: RulesetFunction<object, Options> = async (input, options, context) => {
  return ajv.compileAsync(options.schema).then(validate => {
    validate(input);

    if (validate.errors) {
      return betterAjvErrors(options.schema, validate.errors, {
        propertyPath: context.path,
        targetValue: input,
      }).map(({ suggestion, error, path: errorPath }) => ({
        message: suggestion !== void 0 ? `${error}. ${suggestion}` : error,
        path: [...context.path, ...(errorPath !== '' ? errorPath.replace(/^\//, '').split('/') : [])],
      }));
    }

    return [];
  });
};

export default remoteSchema;
