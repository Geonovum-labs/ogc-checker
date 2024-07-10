import { FC } from 'react';
import { Link } from 'react-router-dom';
import CodeEditor from './components/CodeEditor';
import GitHubIcon from './components/GitHubIcon';
import SpecSelector from './components/SpecSelector';
import building from './examples/building.json';

const initialCode = JSON.stringify(building, undefined, 2);

interface Props {
  spec: string;
}

const App: FC<Props> = () => (
  <div className="flex flex-col h-screen">
    <header className="flex items-center px-4 py-2 bg-slate-700 text-white">
      <div>
        <Link to="/">
          <h1 className="text-lg font-medium">OGC Checker</h1>
        </Link>
      </div>
      <div className="flex items-center ml-auto">
        <SpecSelector className="mr-4" />
        <a href="https://github.com/Geonovum-labs/json-fg-linter" target="_blank">
          <GitHubIcon />
        </a>
      </div>
    </header>
    <div className="flex-1 overflow-hidden">
      <CodeEditor initialCode={initialCode} />
    </div>
  </div>
);

export default App;
