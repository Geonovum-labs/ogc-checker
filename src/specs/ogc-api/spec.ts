import { APPLICATION_JSON_TYPE, APPLICATION_OPENAPI_JSON_3_0_TYPE } from '../../constants';
import { spectralLinter } from '../../spectral';
import { Spec, SpecLinter, SpecResponseMapper } from '../../types';
import { handleResponse, handleResponseJson } from '../../util';
import featuresExample from './examples/features.json';
import recordsExample from './examples/records.json';
import rulesets from './rulesets';

const responseMapper =
  (prefix: string): SpecResponseMapper =>
  async responseText => {
    let document;

    try {
      document = JSON.parse(responseText);
    } catch {
      return Promise.resolve({ content: responseText });
    }

    const links = document.links;

    if (Array.isArray(links)) {
      const serviceDescLink = links.find(link => link.rel === 'service-desc' && link.type === APPLICATION_OPENAPI_JSON_3_0_TYPE);

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
              if (typeof reqClass === 'string' && rulesets[reqClass] && reqClass.startsWith(prefix)) {
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

export const ogcApiFeaturesSpec: Spec = {
  name: 'OGC API - Features',
  slug: 'ogc-api-features',
  example: JSON.stringify(featuresExample, undefined, 2),
  linters: Object.entries(rulesets)
    .filter(entry => entry[0].startsWith('http://www.opengis.net/spec/ogcapi-features-'))
    .map(entry => ({
      name: linterName(entry[0]),
      linter: spectralLinter(linterName(entry[0]), entry[1]),
    })),
  responseMapper: responseMapper('http://www.opengis.net/spec/ogcapi-features-'),
};

export const ogcApiRecordsSpec: Spec = {
  name: 'OGC API - Records',
  slug: 'ogc-api-records',
  example: JSON.stringify(recordsExample, undefined, 2),
  linters: Object.entries(rulesets)
    .filter(entry => entry[0].startsWith('http://www.opengis.net/spec/ogcapi-records-'))
    .map(entry => ({
      name: linterName(entry[0]),
      linter: spectralLinter(linterName(entry[0]), entry[1]),
    })),
  responseMapper: responseMapper('http://www.opengis.net/spec/ogcapi-records-'),
};
