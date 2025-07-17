import { RulesetFunction } from '@stoplight/spectral-core';
import { OpenAPIV3_0 } from '../openapi-types';

interface Options {
  pattern: string;
}

export const hasPathMatch: RulesetFunction<OpenAPIV3_0.PathsObject, Options | undefined> = async (paths, options) => {
  if (!options) {
    return;
  }

  const { pattern } = options;
  const regex = new RegExp(pattern);
  const hasMatch = Object.keys(paths).some(pathKey => regex.test(pathKey));

  if (!hasMatch) {
    return [
      {
        message: `No paths matching pattern "${pattern}" were found.`,
      },
    ];
  }
};

export default hasPathMatch;
