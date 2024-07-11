import { RulesetFunction } from '@stoplight/spectral-core';
import { equals, omit } from 'ramda';
import { OpenAPIV3_0 } from '../openapi-types';
import { errorMessage } from '../util';

interface Options {
  spec: OpenAPIV3_0.ParameterObject;
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

  if (!equals(spec, parameter)) {
    return errorMessage(`Parameter object is not equal to: ${JSON.stringify(options.spec)}.`, [
      ...context.path,
      'parameters',
      paramIndex,
    ]);
  }

  return [];
};

export default hasParameter;
