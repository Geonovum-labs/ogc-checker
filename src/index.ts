import type { RulesetDefinition } from '@stoplight/spectral-core';
import specs from './specs';
import jsonFgRulesets from './specs/json-fg/rulesets';
import ogcApiRulesets from './specs/ogc-api/rulesets';
import { RulesetPlugin, RulesetPluginIndex } from 'standards-checker';

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

const slugFromRulesetUri = (uri: string): string | undefined => {
  const match = uri.match(/spec\/([^/]+)/);

  if (!match) {
    return undefined;
  }

  const base = match[1].replace(/-\d+(?:\.\d+)?$/, '');

  if (base.startsWith('ogcapi')) {
    return base.replace(/^ogcapi/, 'ogc-api');
  }

  return base;
};

const collectRulesetGroups = (...sources: Record<string, RulesetDefinition>[]) => {
  const groups = new Map<string, Record<string, RulesetDefinition>>();

  sources.forEach(map => {
    Object.entries(map).forEach(([uri, definition]) => {
      const slug = slugFromRulesetUri(uri);

      if (!slug || !specsBySlug.has(slug)) {
        return;
      }

      const existing = groups.get(slug) ?? {};
      groups.set(slug, { ...existing, [uri]: definition });
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

const rulesetGroups = collectRulesetGroups(jsonFgRulesets, ogcApiRulesets);

const plugins = Array.from(rulesetGroups.entries()).reduce<RulesetPluginIndex>((acc, [slug, rulesets]) => {
  acc[slug] = buildPlugin({ slug, rulesets });
  return acc;
}, {});

export type { PluginConfig };
export default plugins;
