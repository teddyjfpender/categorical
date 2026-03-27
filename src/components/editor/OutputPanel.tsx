import type { TestRunResult } from '../../lib/types/exercise';

interface OutputPanelProps {
  result: TestRunResult | null;
  isRunning: boolean;
}

export function OutputPanel({ result, isRunning }: OutputPanelProps) {
  if (isRunning) {
    return (
      <div className="p-4 bg-bg-secondary rounded-lg border border-border">
        <div className="flex items-center gap-3 text-text-secondary">
          <div className="animate-spin w-4 h-4 border-2 border-accent border-t-transparent rounded-full" />
          <span className="text-sm">Compiling and running tests...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="p-4 bg-bg-secondary rounded-lg border border-border">
        <p className="text-sm text-text-muted">
          Press <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded text-xs border border-border">Ctrl+Enter</kbd> or click Run to compile and test your code.
        </p>
      </div>
    );
  }

  const hasCompileErrors = result.compilationErrors.length > 0;

  return (
    <div className="bg-bg-secondary rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className={`px-4 py-2 border-b border-border flex items-center justify-between ${result.success ? 'bg-success/10' : 'bg-error/10'}`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${result.success ? 'text-success' : 'text-error'}`}>
            {result.success ? 'All tests passed' : hasCompileErrors ? 'Compilation failed' : 'Tests failed'}
          </span>
        </div>
        <span className="text-xs text-text-muted">{result.executionTimeMs}ms</span>
      </div>

      {/* Compilation errors */}
      {hasCompileErrors && (
        <div className="p-4 border-b border-border">
          <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Compiler Errors</h4>
          {result.compilationErrors.map((error, i) => (
            <div key={i} className="mb-2 last:mb-0">
              <div className="text-xs text-text-muted mb-1">
                Line {error.line}, Column {error.column}
              </div>
              <pre className="text-sm text-error whitespace-pre-wrap font-mono">{error.message}</pre>
            </div>
          ))}
        </div>
      )}

      {/* Test results */}
      {result.tests.length > 0 && (
        <div className="p-4">
          <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Test Results</h4>
          <div className="space-y-1.5">
            {result.tests.map((test, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className={`text-sm mt-0.5 ${test.passed ? 'text-success' : 'text-error'}`}>
                  {test.passed ? '\u2713' : '\u2717'}
                </span>
                <div>
                  <span className="text-sm text-text-primary">{test.name}</span>
                  {test.message && <p className="text-xs text-text-muted mt-0.5">{test.message}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
