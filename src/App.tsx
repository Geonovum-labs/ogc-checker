import { FC } from 'react';
import CodeEditor from './components/CodeEditor';
import LintReport from './components/LintReport';
import building from './examples/building.json';

const App: FC = () => {
  const code = JSON.stringify(building, undefined, 2);

  return (
    <div className="h-screen">
      <header className="p-2 bg-slate-700 text-white">
        <h1 className="font-semibold">JSON-FG Linter</h1>
      </header>
      <div className="flex h-full">
        <div className="w-[50%] h-full overflow-auto">
          <CodeEditor code={code} />
        </div>
        <div className="flex-1 h-full bg-sky-100">
          <LintReport />
        </div>
      </div>
    </div>
  );
};

export default App;
