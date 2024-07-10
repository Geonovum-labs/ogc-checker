import { linter } from '@codemirror/lint';
import { Document, Spectral } from '@stoplight/spectral-core';
import { Json } from '@stoplight/spectral-parsers';
import { DiagnosticSeverity } from '@stoplight/types';
import { Severity, Spec } from '../../types';
import example from './example.json';
import ruleset from './ruleset';

const spectral = new Spectral();
spectral.setRuleset(ruleset);

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

const spectralLinter = linter(view => {
  const doc = view.state.doc;
  const document = new Document(doc.toString(), Json);

  return spectral.run(document).then(violations =>
    violations.map(violation => ({
      from: doc.line(violation.range.start.line + 1).from + violation.range.start.character,
      to: doc.line(violation.range.end.line + 1).from + violation.range.end.character,
      severity: mapSeverity(violation.severity),
      message: violation.message,
    }))
  );
});

const spec: Spec = {
  name: 'OGC API Features',
  slug: 'ogcapi-features',
  example: JSON.stringify(example, undefined, 2),
  linters: [spectralLinter],
};

export default spec;
