import { useProgressStore } from '../../lib/stores/progressStore';
import { href } from '../../lib/paths';
import type { Exercise } from '../../lib/types/exercise';

interface ExerciseSidebarProps {
  exercises: Exercise[];
  currentIndex: number;
  onSelect: (index: number) => void;
  moduleSlug: string;
  lessonSlug: string;
}

const difficultyDot: Record<string, string> = {
  beginner: 'bg-success',
  intermediate: 'bg-warning',
  advanced: 'bg-error',
};

export function ExerciseSidebar({ exercises, currentIndex, onSelect, moduleSlug }: ExerciseSidebarProps) {
  const { isCompleted } = useProgressStore();
  const completedCount = exercises.filter((e) => isCompleted(e.id)).length;

  return (
    <aside className="w-56 flex-shrink-0 border-r border-border bg-bg-secondary flex flex-col overflow-hidden" aria-label="Exercise list">
      {/* Module header */}
      <div className="p-3 border-b border-border">
        <div className="text-[10px] text-text-muted uppercase tracking-wider font-medium mb-1">
          {moduleSlug.replace('-', ' ')}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-secondary">
            {completedCount}/{exercises.length} completed
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-bg-tertiary rounded-full mt-2 overflow-hidden" role="progressbar" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={exercises.length} aria-label="Module progress">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: exercises.length > 0 ? `${(completedCount / exercises.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Exercise list */}
      <nav className="flex-1 overflow-y-auto py-1" aria-label="Exercises">
        {exercises.map((exercise, index) => {
          const done = isCompleted(exercise.id);
          const active = index === currentIndex;

          return (
            <button
              key={exercise.id}
              onClick={() => onSelect(index)}
              aria-current={active ? 'true' : undefined}
              className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 transition-colors duration-150 ${
                active
                  ? 'bg-accent/10 border-r-2 border-accent'
                  : 'hover:bg-bg-hover'
              }`}
            >
              {/* Status indicator */}
              <div className="flex-shrink-0 mt-0.5">
                {done ? (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-success/20 text-success text-xs" aria-label="Completed">
                    {'\u2713'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full border border-border text-[10px] text-text-muted" aria-hidden="true">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Exercise info */}
              <div className="min-w-0">
                <div className={`text-sm leading-snug ${active ? 'text-text-primary font-medium' : 'text-text-secondary'}`}>
                  {exercise.title}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${difficultyDot[exercise.difficulty]}`} aria-hidden="true" />
                  <span className="text-[10px] text-text-muted">{exercise.difficulty}</span>
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="p-3 border-t border-border">
        <a
          href={href('/')}
          className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors duration-150"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <polyline points="8,1 3,6 8,11" />
          </svg>
          All Modules
        </a>
      </div>
    </aside>
  );
}
