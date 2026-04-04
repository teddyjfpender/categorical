import { useState, useCallback } from 'react';
import { CodeEditor } from '../editor/CodeEditor';
import { ConfirmModal } from '../ui/ConfirmModal';
import type { TestRunResult, Language } from '../../lib/types/exercise';

const LANGUAGE_LABELS: Record<Language, string> = {
  haskell: 'Haskell',
  typescript: 'TypeScript',
  rust: 'Rust',
  cuda: 'CUDA',
  rocm: 'ROCm',
};

interface EditorPanelProps {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  onReset: () => void;
  result: TestRunResult | null;
  isRunning: boolean;
  completed: boolean;
  language?: Language;
}

const MIN_OUTPUT_HEIGHT = 80;
const OUTPUT_TOP_MARGIN = 100;

export function EditorPanel({ code, onChange, onRun, onReset, result, isRunning, language = 'haskell' }: EditorPanelProps) {
  const [outputHeight, setOutputHeight] = useState(200);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleDragStart = useCallback(() => {
    document.body.style.cursor = 'row-resize';
    document.body.style.userSelect = 'none';

    const handleMove = (e: MouseEvent) => {
      const container = document.getElementById('editor-panel-container');
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const fromBottom = rect.bottom - e.clientY;
      setOutputHeight(Math.max(MIN_OUTPUT_HEIGHT, Math.min(rect.height - OUTPUT_TOP_MARGIN, fromBottom)));
    };

    const handleUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, []);

  return (
    <div id="editor-panel-container" className="flex flex-col h-full">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-bg-secondary flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-medium">Editor</span>
          <span className="text-[10px] text-text-muted/60">{LANGUAGE_LABELS[language]}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowResetModal(true)}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary border border-border hover:text-text-primary hover:border-border-bright hover:bg-bg-hover active:bg-bg-tertiary transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-border disabled:hover:text-text-secondary"
            aria-label="Reset to starter code"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M2 3v4h4" />
              <path d="M2.5 7A5 5 0 1 1 3.5 10.5" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      {/* Code editor */}
      <div className="flex-1 overflow-hidden">
        <CodeEditor
          value={code}
          onChange={onChange}
          onRun={onRun}
          language={language}
          className="h-full [&_.cm-editor]:h-full [&_.cm-scroller]:!overflow-auto"
        />
      </div>

      {/* Resizable divider */}
      <div
        onMouseDown={handleDragStart}
        className="h-1.5 bg-border hover:bg-accent/50 cursor-row-resize flex-shrink-0 transition-colors duration-150"
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize output panel"
      />

      {/* Output panel */}
      <div style={{ height: outputHeight }} className="flex flex-col overflow-hidden flex-shrink-0" role="region" aria-label="Test output">
        {/* Output header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-bg-secondary flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted font-medium">Output</span>
            {result && (
              <span className={`text-[10px] font-medium ${result.success ? 'text-success' : 'text-error'}`}>
                {result.success ? 'Passed' : 'Failed'}
              </span>
            )}
          </div>
          {result && (
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                result.backend === 'playground'
                  ? 'bg-accent/15 text-accent-bright'
                  : 'bg-bg-tertiary text-text-muted'
              }`}>
                {result.backend === 'playground' ? 'GHC 9.6' : 'Mock'}
              </span>
              <span className="text-[10px] text-text-muted tabular-nums">{result.executionTimeMs}ms</span>
            </div>
          )}
        </div>

        {/* Output content */}
        <div className="flex-1 overflow-y-auto p-3 font-mono text-xs bg-bg-primary" role="log" aria-live="polite">
          {isRunning ? (
            <div className="flex items-center gap-2 text-text-secondary">
              <span className="animate-spin w-3 h-3 border-2 border-accent border-t-transparent rounded-full" aria-hidden="true" />
              Compiling and running tests...
            </div>
          ) : result ? (
            <div>
              {result.compilationErrors.length > 0 && (
                <div className="mb-3">
                  {result.compilationErrors.map((err, i) => (
                    <div key={i} className="mb-2">
                      <span className="text-text-muted">
                        {err.line}:{err.column}:{' '}
                      </span>
                      <span className={err.severity === 'error' ? 'text-error' : 'text-warning'}>
                        {err.severity}:
                      </span>
                      <pre className="text-text-secondary whitespace-pre-wrap ml-2">{err.message}</pre>
                    </div>
                  ))}
                </div>
              )}

              {result.tests.length > 0 && (
                <div>
                  {result.tests.map((test, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1">
                      <span className={test.passed ? 'text-success' : 'text-error'} aria-hidden="true">
                        {test.passed ? '\u2713' : '\u2717'}
                      </span>
                      <span className="text-text-primary">{test.name}</span>
                      {test.message && (
                        <span className="text-text-muted"> - {test.message}</span>
                      )}
                    </div>
                  ))}
                  <div className="mt-3 pt-2 border-t border-border">
                    {result.success ? (
                      <span className="text-success">All tests passed!</span>
                    ) : (
                      <span className="text-error">
                        {result.tests.filter((t) => !t.passed).length} of {result.tests.length} tests failed.
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-text-muted flex items-center justify-center h-full">
              Run or submit code when you're ready.
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={showResetModal}
        title="Reset to starter code?"
        message="This will discard all your changes and restore the original exercise code. This cannot be undone."
        confirmLabel="Reset"
        cancelLabel="Keep editing"
        onConfirm={() => {
          setShowResetModal(false);
          onReset();
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  );
}
