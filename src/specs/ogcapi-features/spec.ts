import { APPLICATION_JSON_TYPE, APPLICATION_OPENAPI_JSON_3_0_TYPE } from '../../constants';
import { spectralLinter } from '../../spectral';
import { Spec, SpecLinter, SpecResponseMapper } from '../../types';
import { handleResponse, handleResponseJson } from '../../util';
import example from './example.json';
import rulesets, { API_FEATURES_1_CORE, API_FEATURES_1_GEOJSON, API_FEATURES_1_OAS3 } from './rulesets';

const responseMapper: SpecResponseMapper = async responseText => {
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
  name: 'OGC API - Features',
  slug: 'ogcapi-features',
  example: JSON.stringify(example, undefined, 2),
  linters: [
    {
      name: linterName(API_FEATURES_1_CORE),
      linter: spectralLinter(linterName(API_FEATURES_1_CORE), rulesets[API_FEATURES_1_CORE]),
    },
    {
      name: linterName(API_FEATURES_1_OAS3),
      linter: spectralLinter(linterName(API_FEATURES_1_OAS3), rulesets[API_FEATURES_1_OAS3]),
    },
    {
      name: linterName(API_FEATURES_1_GEOJSON),
      linter: spectralLinter(linterName(API_FEATURES_1_GEOJSON), rulesets[API_FEATURES_1_GEOJSON]),
    },
  ],
  responseMapper,
};

export default spec;
