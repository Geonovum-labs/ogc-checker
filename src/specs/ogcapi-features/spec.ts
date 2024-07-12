import { APPLICATION_OPENAPI_JSON_3_0_TYPE } from '../../constants';
import { spectralLinter } from '../../spectral';
import { Spec, SpecResponseMapper } from '../../types';
import { handleResponse } from '../../util';
import example from './example.json';
import ruleset from './ruleset';

const responseMapper: SpecResponseMapper = responseText => {
  let document;

  try {
    document = JSON.parse(responseText);
  } catch (err) {
    return Promise.resolve({ content: responseText });
  }

  const links = document.links;

  if (Array.isArray(links)) {
    const serviceDescLink = links.find(
      link => link.rel === 'service-desc' && link.type === APPLICATION_OPENAPI_JSON_3_0_TYPE
    );

    if (serviceDescLink) {
      return fetch(serviceDescLink.href, {
        headers: { Accept: serviceDescLink.type },
      })
        .then(response => handleResponse(response, serviceDescLink.href))
        .then(content => ({ content }));
    }
  }

  return Promise.resolve({ content: responseText });
};

const spec: Spec = {
  name: 'OGC API - Features',
  slug: 'ogcapi-features',
  example: JSON.stringify(example, undefined, 2),
  linters: [spectralLinter(ruleset)],
  responseMapper,
};

export default spec;
