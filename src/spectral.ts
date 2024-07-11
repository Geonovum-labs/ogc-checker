import { linter } from '@codemirror/lint';
import { resolveHttp } from '@stoplight/json-ref-readers';
import { Resolver } from '@stoplight/json-ref-resolver';
import { Document, RulesetDefinition, Spectral } from '@stoplight/spectral-core';
import { Json } from '@stoplight/spectral-parsers';
import { DiagnosticSeverity } from '@stoplight/types';
import { Severity } from './types';

const mapSeverity = (severity: DiagnosticSeverity): Severity => {
  switch (severity) {
    case DiagnosticSeverity.Warning:
      return 'warning';
    case DiagnosticSeverity.Information:
      return 'info';
    case DiagnosticSeverity.Hint:
      return 'hint';
    default:
      return 'error';
  }
};

export const spectralLinter = (ruleset: RulesetDefinition) => {
  const spectral = new Spectral({
    resolver: new Resolver({
      resolvers: {
        http: { resolve: resolveHttp },
        https: { resolve: resolveHttp },
      },
    }),
  });

  spectral.setRuleset(ruleset);

  return linter(view => {
    const doc = view.state.doc;
    const document = new Document(doc.toString(), Json);

    return spectral.run(document).then(violations =>
      violations.map(violation => ({
        from: doc.line(violation.range.start.line + 1).from + violation.range.start.character,
        to: doc.line(violation.range.end.line + 1).from + violation.range.end.character,
        severity: mapSeverity(violation.severity),
        message: `[${violation.code}] ${violation.message}`,
      }))
    );
  });
};
