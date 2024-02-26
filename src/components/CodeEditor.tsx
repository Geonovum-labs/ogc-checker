import { json } from '@codemirror/lang-json';
import ReactCodeMirror, { Extension } from '@uiw/react-codemirror';
import { FC } from 'react';
import schemaValidation from '../validation/schemaValidation';

const EXTENSIONS: Extension[] = [json(), schemaValidation];

interface Props {
  code: string;
}

const CodeEditor: FC<Props> = ({ code }) => {
  return <ReactCodeMirror value={code} extensions={EXTENSIONS} />;
};

export default CodeEditor;
