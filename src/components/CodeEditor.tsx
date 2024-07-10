import { json, jsonParseLinter } from '@codemirror/lang-json';
import { Diagnostic, forEachDiagnostic, linter, lintGutter, setDiagnosticsEffect } from '@codemirror/lint';
import ReactCodeMirror, { EditorSelection, Extension, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { FC, useEffect, useRef, useState } from 'react';
import { Spec } from '../types';

const EXTENSIONS: Extension[] = [json(), linter(jsonParseLinter()), lintGutter()];

interface Props {
  spec: Spec;
}

const CodeEditor: FC<Props> = ({ spec }) => {
  const [value, setValue] = useState('');
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const codeMirrorRef = useRef<ReactCodeMirrorRef>(null);

  useEffect(() => {
    setValue(spec.example ?? '');
    setDiagnostics([]);
  }, [spec]);

  return (
    <div className="flex h-full">
      <div className="w-[50%] min-w-[400px] overflow-auto">
        <ReactCodeMirror
          ref={codeMirrorRef}
          value={value}
          extensions={[EXTENSIONS, ...spec.linters]}
          onUpdate={viewUpdate => {
            viewUpdate.transactions.forEach(transaction => {
              transaction.effects.forEach(effect => {
                if (effect.is(setDiagnosticsEffect)) {
                  const diagnostics: Diagnostic[] = [];
                  forEachDiagnostic(viewUpdate.state, d => diagnostics.push(d));
                  setDiagnostics(diagnostics);
                }
              });
            });

            if (viewUpdate.docChanged) {
              setValue(viewUpdate.state.doc.toString());
            }
          }}
        />
      </div>
      <div className="flex-1 overflow-auto p-4 bg-sky-100">
        {diagnostics.length === 0 && (
          <div className="mb-4 p-4 bg-green-600 text-white rounded shadow-lg">Found no linting errors.</div>
        )}
        {diagnostics.length > 0 && (
          <>
            <div className="mb-4 p-4 bg-red-500 text-white rounded shadow-lg">
              Found {diagnostics.length} linting error(s).
            </div>
            <ul>
              {diagnostics.map((diagnostic, i) => (
                <li key={i}>
                  <div className="mb-4 p-4 bg-white rounded shadow-lg">
                    [{diagnostic.severity}] {diagnostic.message}
                    &nbsp;
                    <span className="text-blue-600 underline">
                      <a
                        href="#"
                        onClick={() =>
                          codeMirrorRef.current?.view?.dispatch({
                            selection: EditorSelection.single(diagnostic.from, diagnostic.to),
                            scrollIntoView: true,
                          })
                        }
                      >
                        (view code)
                      </a>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
