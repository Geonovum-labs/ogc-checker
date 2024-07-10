import { FC } from 'react';
import CodeEditor from './components/CodeEditor';
import GitHubIcon from './components/GitHubIcon';
import building from './examples/building.json';

const initialCode = JSON.stringify(building, undefined, 2);

const App: FC = () => (
  <div className="flex flex-col h-screen">
    <header className="flex px-4 py-2 bg-slate-700 text-white">
      <div>
        <h1 className="font-semibold">JSON-FG Linter</h1>
      </div>
      <div className="ml-auto">
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
