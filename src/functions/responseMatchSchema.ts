import { resolveHttp } from '@stoplight/json-ref-readers';
import { extname } from '@stoplight/path';
import { RulesetFunction } from '@stoplight/spectral-core';
import { Json, Yaml } from '@stoplight/spectral-parsers';
import { Resolver } from '@stoplight/spectral-ref-resolver';
import { APPLICATION_JSON_TYPE } from '../constants';
import { OpenAPIV3_0 } from '../openapi-types';
import { errorMessage, matchSchema } from '../util';

interface Options {
  schemaUri?: string;
  mediaType?: string;
}

const resolver = new Resolver({
  resolvers: {
    http: { resolve: resolveHttp },
    https: { resolve: resolveHttp },
  },
  parseResolveResult: opts => {
    const source = opts.targetAuthority.href().replace(/\/$/, '');
    const parser = extname(source) === '.json' ? Json : Yaml;
    const parseResult = parser.parse(opts.result);

    return Promise.resolve({
      result: parseResult.data,
    });
  },
});

const responseMatchSchema: RulesetFunction<OpenAPIV3_0.ResponseObject, Options> = async (
  response,
  options,
  context
) => {
  if (!options.schemaUri) {
    return;
  }

  const mediaType = options.mediaType ?? APPLICATION_JSON_TYPE;
  const content = response.content ? response.content[mediaType] : undefined;

  if (!content) {
    return errorMessage(`Response media type "${mediaType}" is missing.`, [...context.path, 'content']);
  }

  const schema = content.schema as OpenAPIV3_0.SchemaObject | undefined;

  if (!schema) {
    return errorMessage(`Response schema for media type "${mediaType}" is missing.`, [
      ...context.path,
      'content',
      mediaType,
    ]);
  }

  const refSchema: OpenAPIV3_0.SchemaObject = await fetch(options.schemaUri)
    .then(response => response.text())
    .then(responseText => Yaml.parse(responseText).data)
    .then(responseSchema => resolver.resolve(responseSchema, { baseUri: options.schemaUri }).then(r => r.result));

  const errors = matchSchema(schema, refSchema);

  if (errors.length > 0) {
    return errorMessage(`Response schema is not compatible. ` + errors.join(' '), [
      ...context.path,
      'content',
      mediaType,
    ]);
  }
};

export default responseMatchSchema;
