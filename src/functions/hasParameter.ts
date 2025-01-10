import { IFunctionResult, RulesetFunction } from '@stoplight/spectral-core';
import { equals, omit } from 'ramda';
import { OpenAPIV3_0 } from '../openapi-types';
import { errorMessage, matchSchema } from '../util';

interface Options {
  spec: OpenAPIV3_0.ParameterObject;
  validateSchema?: (schema: OpenAPIV3_0.SchemaObject, paramPath: (string | number)[]) => IFunctionResult[];
}

type OptParamKey = Exclude<keyof OpenAPIV3_0.ParameterObject, 'name' | 'in'>;

const applyDefaults = (parameter: OpenAPIV3_0.ParameterObject): OpenAPIV3_0.ParameterObject => {
  const style = parameter.style ?? (['query', 'cookie'].includes(parameter.in) ? 'form' : 'simple');
  const extProps = Object.keys(parameter).filter(key => /^x-/.test(key)) as OptParamKey[];
  let explode = false;

  if (style === 'form' && ['array', 'object'].includes(parameter.schema?.type ?? '')) {
    explode = parameter.explode ?? true;
  }

  return {
    ...omit(['description', 'example', 'examples', ...extProps], parameter),
    required: parameter.required ?? false,
    deprecated: parameter.deprecated ?? false,
    allowEmptyValue: parameter.allowEmptyValue ?? false,
    style,
    explode,
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
    return options.validateSchema(parameter.schema ?? {}, paramPath);
  } else if (spec.schema) {
    const errors = matchSchema(parameter.schema ?? {}, spec.schema);

    if (errors.length > 0) {
      return errorMessage(`Parameter schema is not compatible. ` + errors.join(' '), [...paramPath, 'schema']);
    }
  }

  if (!equals(omit(['schema'], spec), omit(['schema'], parameter))) {
    return errorMessage(`Parameter object is not compatible with: ${JSON.stringify(options.spec)}.`, paramPath);
  }
};

export default hasParameter;
