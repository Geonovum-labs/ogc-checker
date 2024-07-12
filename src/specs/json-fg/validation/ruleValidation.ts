import { Diagnostic, linter } from '@codemirror/lint';
import { EditorView } from '@uiw/react-codemirror';
import { DocumentTypes, Feature, FeatureCollection, FeatureDocument } from '../../../types';
import { JSON_FG_CORE } from '../spec';
import { getJsonPointers } from './pointers';
import rules from './rules';

export interface RuleViolation {
  pointer: string;
  message: string;
}

export interface Rule {
  name: string;
  validateFeature?: (feature: Feature, isRoot: boolean) => RuleViolation | void;
  validateFeatureCollection?: (FeatureCollection: FeatureCollection) => RuleViolation | void;
}

const applyRule = (rule: Rule, doc: FeatureDocument): RuleViolation[] => {
  const violations: RuleViolation[] = [];

  if (doc.type === DocumentTypes.FEATURE) {
    const violation = rule.validateFeature?.call(this, doc, true);

    if (violation) {
      violations.push(violation);
    }
  }

  if (doc.type === DocumentTypes.FEATURECOLLECTION) {
    const violation = rule.validateFeatureCollection?.call(this, doc);

    if (violation) {
      violations.push(violation);
    }

    doc.features?.forEach((feature, i) => {
      const violation = rule.validateFeature?.call(this, feature, false);

      if (violation) {
        violations.push({
          ...violation,
          pointer: '/features/' + i + violation.pointer,
        });
      }
    });
  }

  return violations;
};

export const applyRules = (rules: Rule[], doc: FeatureDocument): RuleViolation[] =>
  rules.flatMap(rule => applyRule(rule, doc));

const ruleValidation = linter((view: EditorView) => {
  let doc: FeatureDocument;

  try {
    doc = JSON.parse(view.state.doc.toString());
  } catch {
    return [];
  }

  const pointers = getJsonPointers(view.state);
  const diagnostics: Diagnostic[] = [];

  rules.forEach(rule => {
    const violations = applyRule(rule, doc);

    violations.forEach(violation => {
      const coordinates = pointers.get(violation.pointer)!;

      diagnostics.push({
        source: JSON_FG_CORE,
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
