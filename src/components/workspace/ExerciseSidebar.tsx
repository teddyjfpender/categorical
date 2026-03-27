import { useProgressStore } from '../../lib/stores/progressStore';
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
    <div className="w-56 flex-shrink-0 border-r border-border bg-bg-secondary flex flex-col overflow-hidden">
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
        <div className="h-1 bg-bg-tertiary rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: exercises.length > 0 ? `${(completedCount / exercises.length) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex-1 overflow-y-auto py-1">
        {exercises.map((exercise, index) => {
          const completed = isCompleted(exercise.id);
          const active = index === currentIndex;

          return (
            <button
              key={exercise.id}
              onClick={() => onSelect(index)}
              className={`w-full text-left px-3 py-2.5 flex items-start gap-2.5 transition-colors ${
                active
                  ? 'bg-accent/10 border-r-2 border-accent'
                  : 'hover:bg-bg-hover'
              }`}
            >
              {/* Status indicator */}
              <div className="flex-shrink-0 mt-0.5">
                {completed ? (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-success/20 text-success text-xs">
                    {'\u2713'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full border border-border text-[10px] text-text-muted">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Exercise info */}
              <div className="min-w-0">
                <div className={`text-sm leading-snug ${active ? 'text-text-primary' : 'text-text-secondary'}`}>
                  {exercise.title}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${difficultyDot[exercise.difficulty]}`} />
                  <span className="text-[10px] text-text-muted">{exercise.difficulty}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom links */}
      <div className="p-3 border-t border-border">
        <a
          href="/"
          className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="8,1 3,6 8,11" />
          </svg>
          All Modules
        </a>
      </div>
    </div>
  );
}
