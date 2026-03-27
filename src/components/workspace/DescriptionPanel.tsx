import type { Exercise, TestRunResult } from '../../lib/types/exercise';
import { HighlightedContent } from '../ui/HighlightedContent';
import { highlightHaskell } from '../../lib/highlightHaskell';

interface DescriptionPanelProps {
  exercise: Exercise;
  lessonContent: string;
  activeTab: 'description' | 'hints' | 'solution';
  onTabChange: (tab: 'description' | 'hints' | 'solution') => void;
  revealedHints: number;
  onRevealHint: () => void;
  showSolution: boolean;
  onShowSolution: () => void;
  result: TestRunResult | null;
}

export function DescriptionPanel({
  exercise,
  lessonContent,
  activeTab,
  onTabChange,
  revealedHints,
  onRevealHint,
  showSolution,
  onShowSolution,
  result,
}: DescriptionPanelProps) {
  const tabs = [
    { id: 'description' as const, label: 'Description' },
    { id: 'hints' as const, label: 'Hints', count: exercise.hints.length },
    { id: 'solution' as const, label: 'Solution' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex items-center border-b border-border bg-bg-secondary px-1 flex-shrink-0" role="tablist" aria-label="Exercise details">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            className={`px-4 py-2.5 text-sm font-medium transition-colors duration-150 relative ${
              activeTab === tab.id
                ? 'text-text-primary'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-[10px] text-text-muted">({tab.count})</span>
            )}
            <div className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-all duration-200 ${activeTab === tab.id ? 'bg-accent opacity-100' : 'bg-transparent opacity-0'}`} />
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'description' && (
          <div className="p-6" role="tabpanel" id="tabpanel-description">
            {/* Exercise title and metadata */}
            <h2 className="text-xl font-semibold text-text-primary mb-2">{exercise.title}</h2>
            <div className="flex items-center gap-2 mb-5">
              {exercise.concepts.map((concept) => (
                <span
                  key={concept}
                  className="px-2 py-0.5 rounded text-[10px] bg-bg-tertiary text-text-muted font-medium"
                >
                  {concept}
                </span>
              ))}
            </div>

            {/* Description with syntax-highlighted code blocks */}
            <HighlightedContent
              html={exercise.description}
              className="prose-custom text-sm leading-relaxed mb-6"
            />

            {/* Lesson context */}
            {lessonContent && (
              <div className="border-t border-border pt-5">
                <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
                  Lesson Context
                </h3>
                <HighlightedContent
                  html={lessonContent}
                  className="prose-custom text-sm"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'hints' && (
          <div className="p-6" role="tabpanel" id="tabpanel-hints">
            <h3 className="text-sm font-medium text-text-primary mb-4">
              Progressive Hints
            </h3>
            <p className="text-xs text-text-muted mb-5">
              Try to solve the exercise on your own first. Reveal hints one at a time if you get stuck.
            </p>

            <div className="space-y-3">
              {exercise.hints.map((hint, i) => (
                <div key={i}>
                  {i < revealedHints ? (
                    <div className="rounded-lg border border-border bg-bg-secondary p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <HighlightedContent
                          html={hint}
                          className="text-sm text-text-secondary leading-relaxed prose-custom"
                        />
                      </div>
                    </div>
                  ) : i === revealedHints ? (
                    <button
                      onClick={onRevealHint}
                      className="w-full rounded-lg border border-dashed border-border hover:border-border-bright hover:bg-bg-hover/50 p-4 text-sm text-text-muted hover:text-text-secondary active:bg-bg-tertiary transition-colors duration-150 text-left"
                      aria-label={`Reveal hint ${i + 1}`}
                    >
                      <span className="flex items-center gap-2">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="7" cy="7" r="5.5" />
                          <line x1="7" y1="5" x2="7" y2="9" />
                          <line x1="5" y1="7" x2="9" y2="7" />
                        </svg>
                        Reveal Hint {i + 1}
                      </span>
                    </button>
                  ) : (
                    <div className="rounded-lg border border-dashed border-border/50 p-4">
                      <span className="text-xs text-text-muted">Hint {i + 1} — reveal previous hints first</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'solution' && (
          <div className="p-6" role="tabpanel" id="tabpanel-solution">
            {showSolution ? (
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-4">Reference Solution</h3>
                <pre className="rounded-lg bg-bg-secondary border border-border p-4 overflow-x-auto">
                  <code
                    className="text-sm leading-relaxed whitespace-pre"
                    dangerouslySetInnerHTML={{ __html: highlightHaskell(exercise.solutionCode) }}
                  />
                </pre>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-muted">
                    <rect x="3" y="9" width="14" height="8" rx="1.5" />
                    <path d="M6 9V6a4 4 0 0 1 8 0v3" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-text-primary mb-2">Solution Hidden</h3>
                <p className="text-xs text-text-muted mb-5 max-w-xs">
                  Try solving the exercise yourself first. Check the hints tab if you need guidance.
                </p>
                <button
                  onClick={onShowSolution}
                  className="px-4 py-2 rounded-lg text-sm border border-border hover:border-border-bright text-text-secondary hover:text-text-primary transition-colors"
                >
                  Reveal Solution
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom: Test Results (always visible) */}
      {result && (
        <div className="border-t border-border flex-shrink-0">
          <div className={`px-4 py-2 flex items-center justify-between ${result.success ? 'bg-success/5' : 'bg-error/5'}`}>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${result.success ? 'text-success' : 'text-error'}`}>
                {result.success ? '\u2713 All tests passed' : '\u2717 Tests failed'}
              </span>
              <span className="text-[10px] text-text-muted">{result.executionTimeMs}ms</span>
            </div>
          </div>

          {result.tests.length > 0 && (
            <div className="px-4 py-2 max-h-40 overflow-y-auto">
              {result.tests.map((test, i) => (
                <div key={i} className="flex items-start gap-2 py-1">
                  <span className={`text-xs mt-0.5 ${test.passed ? 'text-success' : 'text-error'}`}>
                    {test.passed ? '\u2713' : '\u2717'}
                  </span>
                  <div>
                    <span className="text-xs text-text-primary">{test.name}</span>
                    {test.message && <p className="text-[10px] text-text-muted">{test.message}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {result.compilationErrors.length > 0 && (
            <div className="px-4 py-2 max-h-40 overflow-y-auto">
              {result.compilationErrors.map((err, i) => (
                <div key={i} className="mb-1.5">
                  <span className="text-[10px] text-text-muted">Line {err.line}:{err.column}</span>
                  <pre className="text-xs text-error whitespace-pre-wrap">{err.message}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
