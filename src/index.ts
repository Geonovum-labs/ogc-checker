import type { RulesetDefinition } from '@stoplight/spectral-core';
import { RulesetPlugin, RulesetPluginIndex } from '@geonovum/standards-checker';
import specs from './specs';
import jsonFgRulesets from './specs/json-fg/rulesets';
import ogcApiRulesets from './specs/ogc-api/rulesets';
import { ogcapiFeatures as ogcApiFeaturesPrefix, ogcApiProcesses as ogcApiProcessesPrefix, ogcApiRecords as ogcApiRecordsPrefix } from './specs/ogc-api/spec';

/**
 * Minimal metadata needed to construct a CLI-ready ruleset plugin.
 * Consumers add a new entry here and let the helper produce the final structure.
 */
interface PluginConfig {
  slug: string;
  rulesets: Record<string, RulesetDefinition>;
  version?: string;
  description?: string;
  targets?: string[];
}

const specsBySlug = new Map(specs.map(spec => [spec.slug, spec]));

interface RulesetTarget {
  slug: string;
  filter?: (uri: string, definition: RulesetDefinition) => boolean;
}

interface RulesetSource {
  slug: string;
  rulesets: Record<string, RulesetDefinition>;
  targets?: RulesetTarget[];
}

const collectRulesetGroups = (...sources: RulesetSource[]) => {
  const groups = new Map<string, Record<string, RulesetDefinition>>();

  sources.forEach(({ slug, rulesets, targets }) => {
    const resolvedTargets = targets ?? [{ slug }];

    resolvedTargets.forEach(({ slug: targetSlug, filter }) => {
      if (!specsBySlug.has(targetSlug)) {
        return;
      }

      const subset = filter
        ? Object.fromEntries(Object.entries(rulesets).filter(([uri, definition]) => filter(uri, definition)))
        : rulesets;

      if (!Object.keys(subset).length) {
        return;
      }

      const existing = groups.get(targetSlug) ?? {};
      groups.set(targetSlug, { ...existing, ...subset });
    });
  });

  return groups;
};

const buildPlugin = ({ slug, rulesets }: PluginConfig): RulesetPlugin => {
  return {
    id: slug,
    rulesets,
  };
};

const rulesetGroups = collectRulesetGroups(
  { slug: 'json-fg', rulesets: jsonFgRulesets },
  {
    slug: 'ogc-api',
    rulesets: ogcApiRulesets,
    targets: [
      { slug: 'ogc-api-features', filter: uri => uri.startsWith(ogcApiFeaturesPrefix) },
      { slug: 'ogc-api-processes', filter: uri => uri.startsWith(ogcApiProcessesPrefix) },
      { slug: 'ogc-api-records', filter: uri => uri.startsWith(ogcApiRecordsPrefix) },
    ],
  },
);

const plugins = Array.from(rulesetGroups.entries()).reduce<RulesetPluginIndex>((acc, [slug, rulesets]) => {
  acc[slug] = buildPlugin({ slug, rulesets });
  return acc;
}, {});

export type { PluginConfig };
export default plugins;
