import { useEffect, useRef, useCallback } from 'react';
import { Confetti } from './Confetti';
import type { TestRunResult } from '../../lib/types/exercise';

interface ResultModalProps {
  open: boolean;
  result: TestRunResult;
  exerciseTitle: string;
  nextExerciseTitle?: string;
  onClose: () => void;
  onNextExercise?: () => void;
}

export function ResultModal({
  open,
  result,
  exerciseTitle,
  nextExerciseTitle,
  onClose,
  onNextExercise,
}: ResultModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    primaryRef.current?.focus();
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  const isSuccess = result.success;
  const failedTests = result.tests.filter((t) => !t.passed);
  const passedTests = result.tests.filter((t) => t.passed);
  const hasCompileErrors = result.compilationErrors.length > 0;

  return (
    <>
      <Confetti
        active={isSuccess}
        colors={['#34d399', '#8b5cf6', '#a78bfa', '#fbbf24', '#60a5fa']}
        particleCount={80}
        duration={3000}
      />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="result-modal-title"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <div
          ref={modalRef}
          className="relative bg-bg-card border border-border rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        >
          {/* Header */}
          <div className={`px-6 pt-6 pb-4 ${isSuccess ? 'bg-success/5' : 'bg-error/5'}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`text-3xl ${isSuccess ? '' : ''}`} aria-hidden="true">
                {isSuccess ? '\u2713' : '\u2717'}
              </span>
              <h3
                id="result-modal-title"
                className={`text-xl font-bold ${isSuccess ? 'text-success' : 'text-error'}`}
              >
                {isSuccess ? 'All Tests Passed!' : 'Not Quite Right'}
              </h3>
            </div>
            <p className="text-sm text-text-secondary">
              {exerciseTitle}
            </p>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            {isSuccess ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-text-secondary">
                    {passedTests.length} test{passedTests.length !== 1 ? 's' : ''} passed
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      result.backend === 'playground'
                        ? 'bg-accent/15 text-accent-bright'
                        : 'bg-bg-tertiary text-text-muted'
                    }`}>
                      {result.backend === 'playground' ? 'GHC 9.6' : 'Mock'}
                    </span>
                    <span className="text-xs text-text-muted tabular-nums">{result.executionTimeMs}ms</span>
                  </div>
                </div>

                {/* Test list */}
                <div className="space-y-1 mb-4">
                  {passedTests.slice(0, 5).map((test, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-success">{'\u2713'}</span>
                      <span className="text-text-secondary">{test.name}</span>
                    </div>
                  ))}
                  {passedTests.length > 5 && (
                    <p className="text-xs text-text-muted ml-5">
                      +{passedTests.length - 5} more
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div>
                {/* Compilation errors */}
                {hasCompileErrors && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-error mb-2">Compilation Error</h4>
                    <div className="rounded-lg bg-bg-secondary border border-border p-3 max-h-32 overflow-y-auto">
                      {result.compilationErrors.slice(0, 3).map((err, i) => (
                        <div key={i} className="mb-2 last:mb-0">
                          <span className="text-xs text-text-muted">Line {err.line}</span>
                          <pre className="text-xs text-text-primary whitespace-pre-wrap mt-0.5 font-mono">{err.message}</pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Test failures */}
                {failedTests.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-text-primary mb-2">
                      {failedTests.length} of {result.tests.length} test{result.tests.length !== 1 ? 's' : ''} failed
                    </h4>
                    <div className="space-y-1.5">
                      {failedTests.slice(0, 4).map((test, i) => (
                        <div key={i} className="rounded-lg bg-bg-secondary border border-border p-2.5">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-error">{'\u2717'}</span>
                            <span className="text-text-primary">{test.name}</span>
                          </div>
                          {test.message && (
                            <p className="text-xs text-text-muted mt-1 ml-5">{test.message}</p>
                          )}
                        </div>
                      ))}
                      {failedTests.length > 4 && (
                        <p className="text-xs text-text-muted">
                          +{failedTests.length - 4} more failure{failedTests.length - 4 !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Passed tests (if any) */}
                {passedTests.length > 0 && (
                  <p className="text-xs text-text-muted mb-3">
                    {passedTests.length} test{passedTests.length !== 1 ? 's' : ''} passed
                  </p>
                )}

                <p className="text-xs text-text-muted italic">
                  Check the Hints tab for guidance.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-bg-secondary/50">
            {isSuccess ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover border border-border transition-colors duration-150"
                >
                  Stay Here
                </button>
                {onNextExercise && nextExerciseTitle ? (
                  <button
                    ref={primaryRef}
                    onClick={() => {
                      onClose();
                      onNextExercise();
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-success/20 text-success hover:bg-success/30 border border-success/30 transition-colors duration-150"
                  >
                    Continue: {nextExerciseTitle}
                  </button>
                ) : (
                  <button
                    ref={primaryRef}
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-accent/20 text-accent-bright hover:bg-accent/30 border border-accent/30 transition-colors duration-150"
                  >
                    Module Complete!
                  </button>
                )}
              </>
            ) : (
              <button
                ref={primaryRef}
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-accent hover:bg-accent-bright text-white transition-colors duration-150"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
