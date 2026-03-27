interface ExerciseControlsProps {
  onRun: () => void;
  onReset: () => void;
  onHint: () => void;
  onSolution: () => void;
  isRunning: boolean;
  hasMoreHints: boolean;
  completed: boolean;
}

export function ExerciseControls({
  onRun,
  onReset,
  onHint,
  onSolution,
  isRunning,
  hasMoreHints,
  completed,
}: ExerciseControlsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={onRun}
          disabled={isRunning}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isRunning
              ? 'bg-accent/50 text-white/70 cursor-not-allowed'
              : completed
                ? 'bg-success/20 text-success hover:bg-success/30'
                : 'bg-accent hover:bg-accent-bright text-white'
          }`}
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin w-3 h-3 border-2 border-white/50 border-t-white rounded-full" />
              Running...
            </span>
          ) : completed ? (
            'Run Again'
          ) : (
            'Run'
          )}
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center gap-2">
        {hasMoreHints && (
          <button
            onClick={onHint}
            className="px-3 py-1.5 rounded-lg text-xs text-text-secondary border border-border hover:border-border-bright hover:text-text-primary transition-colors"
          >
            Show Hint
          </button>
        )}
        <button
          onClick={onSolution}
          className="px-3 py-1.5 rounded-lg text-xs text-text-muted border border-border hover:border-border-bright hover:text-text-secondary transition-colors"
        >
          Show Solution
        </button>
      </div>
    </div>
  );
}
