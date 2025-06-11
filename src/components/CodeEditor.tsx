import { json, jsonParseLinter } from '@codemirror/lang-json';
import { forEachDiagnostic, linter, lintGutter, setDiagnosticsEffect } from '@codemirror/lint';
import ReactCodeMirror, { EditorSelection, Extension, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import clsx from 'clsx';
import { isEmpty } from 'ramda';
import { FC, useEffect, useRef, useState } from 'react';
import { Diagnostic, Spec, SpecInput, SpecLinter } from '../types';
import { formatDocument, groupBySource, handleResponse } from '../util';

const EXTENSIONS: Extension[] = [json(), linter(jsonParseLinter()), lintGutter()];

interface Props {
  spec: Spec;
  uri?: string;
}

const CodeEditor: FC<Props> = ({ spec, uri }) => {
  const [content, setContent] = useState('{}');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string>();
  const [linters, setLinters] = useState<SpecLinter[]>([]);
  const [diagnostics, setDiagnostics] = useState<{ [key: string]: Diagnostic[] }>({});
  const codeMirrorRef = useRef<ReactCodeMirrorRef>(null);

  useEffect(() => {
    setContent(spec.example);
    setLinters(spec.linters);
  }, [spec]);

  useEffect(() => {
    if (uri) {
      setError(undefined);
      setChecking(true);
      setDiagnostics({});

      fetch(uri)
        .then(response => handleResponse(response, uri))
        .then(responseText =>
          spec.responseMapper //
            ? spec.responseMapper(responseText)
            : Promise.resolve({ content: responseText })
        )
        .then((input: SpecInput) => {
          setChecking(false);
          setContent(formatDocument(input.content));
          setLinters(input.linters ?? spec.linters);
        })
        .catch(error => {
          setChecking(false);
          setError(error.message);
        });
    }
  }, [uri, spec]);

  return (
    <div className="flex h-full">
      <div className="w-[50%] min-w-[400px] overflow-auto">
        <ReactCodeMirror
          ref={codeMirrorRef}
          value={content}
          extensions={[...EXTENSIONS, ...linters.map(l => l.linter)]}
          onUpdate={viewUpdate => {
            if (error) {
              return;
            }

            viewUpdate.transactions.forEach(transaction => {
              transaction.effects.forEach(effect => {
                if (effect.is(setDiagnosticsEffect)) {
                  const diagnostics: Diagnostic[] = [];
                  forEachDiagnostic(viewUpdate.state, d => diagnostics.push(d));
                  setDiagnostics(groupBySource(diagnostics));
                  setChecking(false);
                }
              });
            });

            if (viewUpdate.docChanged) {
              setContent(viewUpdate.state.doc.toString());
              setChecking(true);
            }
          }}
        />
      </div>
      <div className="flex-1 overflow-auto p-4 bg-sky-100 text-sm">
        {checking && <p>Checking...</p>}
        {!checking && error && <div className="mb-4 p-4 bg-red-500 text-white rounded-sm shadow-lg">{error}</div>}
        {!checking && !error && isEmpty(linters) && <p>No matching rulesets found.</p>}
        {!checking &&
          !error &&
          linters.map(linter => (
            <div key={linter.name}>
              {!diagnostics[linter.name] ? (
                <div className="mb-4 p-4 bg-green-600 text-white rounded-sm shadow-lg">[{linter.name}] No violations found.</div>
              ) : (
                <>
                  <div className="mb-4 p-4 bg-red-500 text-white rounded-sm shadow-lg">
                    [{linter.name}] Found {diagnostics[linter.name].length} linting error(s).
                  </div>
                  <ul>
                    {diagnostics[linter.name].map((diagnostic, i) => (
                      <li key={i}>
                        <div
                          className={clsx('mb-4 p-4 rounded-sm shadow-lg', {
                            'bg-red-200': diagnostic.severity === 'error',
                            'bg-yellow-100': diagnostic.severity === 'warning',
                            'bg-white': diagnostic.severity === 'info' || diagnostic.severity === 'hint',
                          })}
                        >
                          {diagnostic.message}
                          &nbsp;
                          <span className="text-blue-600 underline">
                            <a
                              className="cursor-pointer"
                              onClick={() =>
                                codeMirrorRef.current?.view?.dispatch({
                                  selection: EditorSelection.single(diagnostic.from, diagnostic.to),
                                  scrollIntoView: true,
                                })
                              }
                            >
                              (show in editor)
                            </a>
                          </span>
                          {diagnostic.documentationUrl && (
                            <>
                              &nbsp;
                              <span className="text-blue-600 underline">
                                <strong>{diagnostic.documentationUrl}</strong>
                                <a href={diagnostic.documentationUrl} target="_blank" rel="noopener noreferrer">
                                  (documentation)
                                </a>
                              </span>
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default CodeEditor;
