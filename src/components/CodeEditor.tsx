import { json, jsonParseLinter } from '@codemirror/lang-json';
import { Diagnostic, forEachDiagnostic, linter, lintGutter, setDiagnosticsEffect } from '@codemirror/lint';
import ReactCodeMirror, { EditorSelection, Extension, ReactCodeMirrorRef } from '@uiw/react-codemirror';
import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { Spec } from '../types';

const EXTENSIONS: Extension[] = [json(), linter(jsonParseLinter()), lintGutter()];

interface Props {
  spec: Spec;
  uri?: string;
}

const CodeEditor: FC<Props> = ({ spec, uri }) => {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const codeMirrorRef = useRef<ReactCodeMirrorRef>(null);

  useEffect(() => {
    setValue(spec.example ?? '');
    setDiagnostics([]);
  }, [spec]);

  useEffect(() => {
    if (uri) {
      setValue('');
      setLoading(true);

      fetch(uri)
        .then(response => response.text())
        .then(responseText => setValue(responseText));
    }
  }, [uri]);

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
                  setLoading(false);
                }
              });
            });

            if (viewUpdate.docChanged) {
              setValue(viewUpdate.state.doc.toString());
              setLoading(true);
            }
          }}
        />
      </div>
      <div className="flex-1 overflow-auto p-4 bg-sky-100 text-sm">
        {loading && <p>Checking...</p>}
        {!loading && diagnostics.length === 0 && (
          <div className="mb-4 p-4 bg-green-600 text-white rounded shadow-lg">Found no linting errors.</div>
        )}
        {!loading && diagnostics.length > 0 && (
          <>
            <div className="mb-4 p-4 bg-red-500 text-white rounded shadow-lg">
              Found {diagnostics.length} linting error(s).
            </div>
            <ul>
              {diagnostics.map((diagnostic, i) => (
                <li key={i}>
                  <div
                    className={clsx('mb-4 p-4 rounded shadow-lg', {
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
                        (show)
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
