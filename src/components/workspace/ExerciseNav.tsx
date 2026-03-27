import type { Difficulty } from '../../lib/types/exercise';

interface ExerciseNavProps {
  moduleTitle: string;
  lessonTitle: string;
  exerciseTitle: string;
  difficulty: Difficulty;
  currentIndex: number;
  totalExercises: number;
  completed: boolean;
  isRunning: boolean;
  onRun: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

const difficultyColors: Record<Difficulty, string> = {
  beginner: 'bg-success/20 text-success',
  intermediate: 'bg-warning/20 text-warning',
  advanced: 'bg-error/20 text-error',
};

export function ExerciseNav({
  moduleTitle,
  exerciseTitle,
  difficulty,
  currentIndex,
  totalExercises,
  completed,
  isRunning,
  onRun,
  onPrev,
  onNext,
  onToggleSidebar,
  sidebarOpen,
}: ExerciseNavProps) {
  return (
    <nav className="h-12 flex items-center justify-between px-4 border-b border-border bg-bg-secondary flex-shrink-0" aria-label="Exercise navigation">
      {/* Left: sidebar toggle + breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors duration-150"
          aria-label={sidebarOpen ? 'Hide exercise sidebar' : 'Show exercise sidebar'}
          aria-expanded={sidebarOpen}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            {sidebarOpen ? (
              <>
                <rect x="1" y="2" width="14" height="12" rx="1.5" />
                <line x1="5.5" y1="2" x2="5.5" y2="14" />
              </>
            ) : (
              <>
                <line x1="2" y1="4" x2="14" y2="4" />
                <line x1="2" y1="8" x2="14" y2="8" />
                <line x1="2" y1="12" x2="14" y2="12" />
              </>
            )}
          </svg>
        </button>

        <div className="flex items-center gap-2 text-sm min-w-0">
          <a href="/" className="text-text-muted hover:text-text-secondary transition-colors duration-150" aria-label="Home">
            <span className="text-accent font-semibold">C</span>
          </a>
          <span className="text-text-muted/40" aria-hidden="true">/</span>
          <span className="text-text-muted truncate">{moduleTitle}</span>
          <span className="text-text-muted/40" aria-hidden="true">/</span>
          <span className="text-text-primary truncate font-medium">{exerciseTitle}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${difficultyColors[difficulty]}`}>
            {difficulty}
          </span>
          {completed && (
            <span className="text-success text-sm flex-shrink-0" aria-label="Completed">{'\u2713'}</span>
          )}
        </div>
      </div>

      {/* Center: exercise navigation */}
      <div className="flex items-center gap-1" role="group" aria-label="Exercise pagination">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="p-2 rounded-lg hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Previous exercise"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <polyline points="9,2 4,7 9,12" />
          </svg>
        </button>
        <span className="text-xs text-text-muted px-2 tabular-nums" aria-label={`Exercise ${currentIndex + 1} of ${totalExercises}`}>
          {currentIndex + 1} / {totalExercises}
        </span>
        <button
          onClick={onNext}
          disabled={currentIndex === totalExercises - 1}
          className="p-2 rounded-lg hover:bg-bg-hover text-text-muted hover:text-text-primary transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          aria-label="Next exercise"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <polyline points="5,2 10,7 5,12" />
          </svg>
        </button>
      </div>

      {/* Right: run button */}
      <div className="flex items-center gap-3">
        <kbd className="hidden sm:inline text-[10px] text-text-muted px-1.5 py-0.5 rounded border border-border bg-bg-tertiary">
          {'\u2318'}Enter
        </kbd>
        <button
          onClick={onRun}
          disabled={isRunning}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
            isRunning
              ? 'bg-accent/50 text-white/70 cursor-not-allowed'
              : completed
                ? 'bg-success/20 text-success hover:bg-success/30 border border-success/30'
                : 'bg-accent hover:bg-accent-bright text-white active:scale-[0.97]'
          }`}
          aria-label={isRunning ? 'Running code' : 'Run code'}
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin w-3 h-3 border-2 border-white/50 border-t-white rounded-full" aria-hidden="true" />
              Running
            </span>
          ) : (
            'Run Code'
          )}
        </button>
      </div>
    </nav>
  );
}
