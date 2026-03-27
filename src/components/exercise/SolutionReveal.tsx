import { CodeEditor } from '../editor/CodeEditor';

interface SolutionRevealProps {
  solutionCode: string;
  onLoadSolution: () => void;
}

export function SolutionReveal({ solutionCode, onLoadSolution }: SolutionRevealProps) {
  return (
    <div className="rounded-lg border border-border bg-bg-secondary overflow-hidden">
      <div className="px-4 py-2 border-b border-border flex items-center justify-between">
        <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          Reference Solution
        </h4>
        <button
          onClick={onLoadSolution}
          className="text-xs text-accent hover:text-accent-bright transition-colors"
        >
          Load into editor
        </button>
      </div>
      <div className="p-2">
        <CodeEditor value={solutionCode} readOnly className="max-h-[300px] overflow-auto" />
      </div>
    </div>
  );
}
