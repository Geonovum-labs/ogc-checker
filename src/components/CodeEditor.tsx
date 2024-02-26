import { json } from '@codemirror/lang-json';
import ReactCodeMirror, { Extension } from '@uiw/react-codemirror';
import { FC } from 'react';
import ruleValidation from '../validation/ruleValidation';
import schemaValidation from '../validation/schemaValidation';

const EXTENSIONS: Extension[] = [json(), schemaValidation, ruleValidation];

interface Props {
  code: string;
}

const CodeEditor: FC<Props> = ({ code }) => {
  return <ReactCodeMirror value={code} extensions={EXTENSIONS} />;
};

export default CodeEditor;
