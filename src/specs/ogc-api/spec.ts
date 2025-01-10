import { APPLICATION_JSON_TYPE, APPLICATION_OPENAPI_JSON_3_0_TYPE } from '../../constants';
import { spectralLinter } from '../../spectral';
import { Spec, SpecLinter, SpecResponseMapper } from '../../types';
import { handleResponse, handleResponseJson } from '../../util';
import example from './example.json';
import rulesets from './rulesets';

const responseMapper: SpecResponseMapper = async responseText => {
  let document;

  try {
    document = JSON.parse(responseText);
  } catch {
    return Promise.resolve({ content: responseText });
  }

  const links = document.links;

  if (Array.isArray(links)) {
    const serviceDescLink = links.find(
      link => link.rel === 'service-desc' && link.type === APPLICATION_OPENAPI_JSON_3_0_TYPE
    );

    const conformanceLink = links.find(link => link.rel === 'conformance');

    if (serviceDescLink) {
      const content = await fetch(serviceDescLink.href, {
        headers: { Accept: serviceDescLink.type },
      }).then(response => handleResponse(response, serviceDescLink.href));

      const linters: SpecLinter[] = [];

      if (conformanceLink) {
        const conformance = await fetch(conformanceLink.href, {
          headers: { Accept: APPLICATION_JSON_TYPE },
        }).then(response => handleResponseJson(response, conformanceLink.href));

        const conformsTo = conformance.conformsTo;

        if (Array.isArray(conformsTo)) {
          conformsTo.forEach(reqClass => {
            if (typeof reqClass === 'string' && rulesets[reqClass]) {
              linters.push({
                name: reqClass,
                linter: spectralLinter(reqClass, rulesets[reqClass]),
              });
            }
          });
        }
      }

      return { content, linters };
    }
  }

  return Promise.resolve({ content: responseText });
};

const linterName = (confClass: string) => confClass.replace('http://www.opengis.net/spec/', '');

const spec: Spec = {
  name: 'OGC API',
  slug: 'ogc-api',
  example: JSON.stringify(example, undefined, 2),
  linters: Object.entries(rulesets).map(entry => ({
    name: linterName(entry[0]),
    linter: spectralLinter(linterName(entry[0]), entry[1]),
  })),
  responseMapper,
};

export default spec;
