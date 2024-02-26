import { Diagnostic, linter } from '@codemirror/lint';
import { EditorView } from '@uiw/react-codemirror';
import { DocumentTypes, Feature, FeatureCollection, FeatureDocument } from '../types';
import { getJsonPointers } from './pointers';
import rules from './rules';

export interface RuleViolation {
  pointer: string;
  message: string;
}

export interface Rule {
  name: string;
  validateFeature?: (feature: Feature) => RuleViolation | void;
  validateFeatureCollection?: (FeatureCollection: FeatureCollection) => RuleViolation | void;
}

const ruleValidation = linter((view: EditorView) => {
  const code = view.state.doc.toString();
  const doc = JSON.parse(code) as FeatureDocument;
  const pointers = getJsonPointers(view.state);
  const diagnostics: Diagnostic[] = [];

  rules.forEach(rule => {
    const violations: RuleViolation[] = [];

    if (doc.type === DocumentTypes.FEATURE) {
      const violation = rule.validateFeature?.call(this, doc);

      if (violation) {
        violations.push(violation);
      }
    }

    if (doc.type === DocumentTypes.FEATURE_COLLECTION) {
      const violation = rule.validateFeatureCollection?.call(this, doc);

      if (violation) {
        violations.push(violation);
      }

      doc.features.forEach(feature => {
        const violation = rule.validateFeature?.call(this, feature);

        if (violation) {
          violations.push(violation);
        }
      });
    }

    violations.forEach(violation => {
      const coordinates = pointers.get(violation.pointer)!;

      diagnostics.push({
        from: coordinates.valueFrom,
        to: coordinates.valueTo,
        severity: 'error',
        message: violation.message,
      });
    });
  });

  return diagnostics;
});

export default ruleValidation;
