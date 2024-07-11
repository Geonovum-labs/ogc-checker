import { IFunctionResult, RulesetFunction } from '@stoplight/spectral-core';
import { equals, omit } from 'ramda';
import { OpenAPIV3_0 } from '../openapi-types';
import { errorMessage } from '../util';

interface Options {
  spec: OpenAPIV3_0.ParameterObject;
  validateSchema?: (schema: OpenAPIV3_0.SchemaObject, paramPath: (string | number)[]) => IFunctionResult[];
}

const applyDefaults = (parameter: OpenAPIV3_0.ParameterObject): OpenAPIV3_0.ParameterObject => {
  const style = parameter.style ?? (['query', 'cookie'].includes(parameter.in) ? 'form' : 'simple');

  return {
    ...omit(['description', 'example', 'examples'], parameter),
    required: parameter.required ?? false,
    deprecated: parameter.deprecated ?? false,
    allowEmptyValue: parameter.allowEmptyValue ?? false,
    style,
    explode: parameter.explode ?? style === 'form',
    allowReserved: parameter.allowReserved ?? false,
  };
};

const hasParameter: RulesetFunction<OpenAPIV3_0.OperationObject, Options> = (operation, options, context) => {
  const spec: OpenAPIV3_0.ParameterObject = applyDefaults(options.spec);

  if (!operation.parameters) {
    return errorMessage(`Parameter "${spec.name}" is missing.`);
  }

  const paramIndex = operation.parameters.findIndex(param => param.name === spec.name);

  if (paramIndex === -1) {
    return errorMessage(`Parameter "${spec.name}" is missing.`, [...context.path, 'parameters']);
  }

  const parameter = applyDefaults(operation.parameters[paramIndex]);
  const paramPath = [...context.path, 'parameters', paramIndex];

  if (options.validateSchema) {
    if (!equals(omit(['schema'], spec), omit(['schema'], parameter))) {
      return errorMessage(`Parameter object is not equal to: ${JSON.stringify(options.spec)}.`, paramPath);
    }

    return options.validateSchema(parameter.schema ?? {}, paramPath);
  }

  if (!equals(spec, parameter)) {
    // TODO: Ignore properties which have no impact on validation (such as $id, $schema and description)
    return errorMessage(`Parameter object is not equal to: ${JSON.stringify(options.spec)}.`, paramPath);
  }

  return [];
};

export default hasParameter;
