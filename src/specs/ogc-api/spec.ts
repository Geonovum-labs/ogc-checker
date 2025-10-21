import {
  APPLICATION_JSON_TYPE,
  APPLICATION_OPENAPI_JSON_3_0_TYPE,
  handleResponse,
  handleResponseJson,
  Spec,
  SpecLinter,
  SpecResponseMapper,
  spectralLinter,
} from '@geonovum/standards-checker';

import featuresExample from './examples/features.json';
import processesExample from './examples/processes.json';
import recordsExample from './examples/records.json';
import rulesets from './rulesets';
import { RulesetDefinition } from '@stoplight/spectral-core';

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
export const ogcapiFeatures = 'http://www.opengis.net/spec/ogcapi-features-';
export const ogcApiProcesses = 'http://www.opengis.net/spec/ogcapi-processes-';
export const ogcApiRecords = 'http://www.opengis.net/spec/ogcapi-records-';

export const ogcApiFeaturesSpec: Spec = {
  name: 'OGC API - Features',
  slug: 'ogc-api-features',
  example: JSON.stringify(featuresExample, undefined, 2),
  linters: Object.entries(rulesets)
    .filter(entry => entry[0].startsWith(ogcapiFeatures))
    .map(entry => ({
      name: linterName(entry[0]),
      linter: spectralLinter(linterName(entry[0]), entry[1] as RulesetDefinition),
    })),
  responseMapper: responseMapper(ogcapiFeatures),
};

export const ogcApiProcessesSpec: Spec = {
  name: 'OGC API - Processes',
  slug: 'ogc-api-processes',
  example: JSON.stringify(processesExample, undefined, 2),
  linters: Object.entries(rulesets)
    .filter(entry => entry[0].startsWith(ogcApiProcesses))
    .map(entry => ({
      name: linterName(entry[0]),
      linter: spectralLinter(linterName(entry[0]), entry[1] as RulesetDefinition),
    })),
  responseMapper: responseMapper(ogcApiProcesses),
};

export const ogcApiRecordsSpec: Spec = {
  name: 'OGC API - Records',
  slug: 'ogc-api-records',
  example: JSON.stringify(recordsExample, undefined, 2),
  linters: Object.entries(rulesets)
    .filter(entry => entry[0].startsWith(ogcApiRecords))
    .map(entry => ({
      name: linterName(entry[0]),
      linter: spectralLinter(linterName(entry[0]), entry[1] as RulesetDefinition),
    })),
  responseMapper: responseMapper(ogcApiRecords),
};
