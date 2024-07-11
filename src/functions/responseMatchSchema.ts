import { Resolver } from '@stoplight/json-ref-resolver';
import { RulesetFunction } from '@stoplight/spectral-core';
import { Yaml } from '@stoplight/spectral-parsers';
import { clone } from 'ramda';
import { APPLICATION_JSON_TYPE } from '../constants';
import { OpenAPIV3_0 } from '../openapi-types';
import { errorMessage, matchSchema } from '../util';

interface Options {
  schemaUri?: string;
}

const resolver = new Resolver();

const responseMatchSchema: RulesetFunction<OpenAPIV3_0.ResponseObject | undefined, Options> = async (
  response,
  options
) => {
  if (!options.schemaUri) {
    return [];
  }

  if (!response) {
    return errorMessage('A response with status code 200 is missing.');
  }

  const content = response.content ? response.content[APPLICATION_JSON_TYPE] : undefined;

  if (!content) {
    return errorMessage('Response media type `application/json` is missing.');
  }

  const schema = content.schema as OpenAPIV3_0.SchemaObject | undefined;

  if (!schema) {
    return errorMessage('Response schema for JSON media type is missing.');
  }

  const refSchema: OpenAPIV3_0.SchemaObject = await fetch(options.schemaUri)
    .then(response => response.text())
    .then(responseText => Yaml.parse(responseText).data)
    .then(responseSchema => resolver.resolve(responseSchema).then(r => clone(r.result)));

  const errors = matchSchema(schema, refSchema);

  if (errors.length > 0) {
    return errorMessage(`Response schema is not compatible. ` + errors.join(' '));
  }

  return [];
};

export default responseMatchSchema;
