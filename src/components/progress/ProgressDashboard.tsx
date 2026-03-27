import { useProgressStore } from '../../lib/stores/progressStore';
import { getExercisesByModule, getAllExercises } from '../../lib/exercises';

interface ModuleCard {
  slug: string;
  title: string;
  description: string;
  icon: string;
  lessons: Array<{
    title: string;
    path: string;
    exerciseIds: string[];
  }>;
}

const moduleCards: ModuleCard[] = [
  {
    slug: 'type-systems',
    title: 'Type Systems',
    description: 'From basic types and ADTs to GADTs, type families, and dependent types.',
    icon: '\u03BB',
    lessons: [
      {
        title: 'Basic Types and Annotations',
        path: '/type-systems/basic-types',
        exerciseIds: ['type-annotations', 'algebraic-data-types', 'parametric-polymorphism'],
      },
    ],
  },
  {
    slug: 'category-theory',
    title: 'Category Theory',
    description: 'Functors, natural transformations, monads, and adjunctions — through code.',
    icon: '\u2219',
    lessons: [
      {
        title: 'Functors: Mapping Over Structure',
        path: '/category-theory/functors',
        exerciseIds: ['functor-instance', 'functor-laws', 'natural-transformation'],
      },
    ],
  },
];

export function ProgressDashboard() {
  const { isCompleted, completedExercises, resetProgress } = useProgressStore();
  const allExercises = getAllExercises();
  const totalCompleted = completedExercises.length;
  const totalExercises = allExercises.length;

  return (
    <div>
      {/* Overall stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-bg-card border border-border">
          <div className="text-3xl font-bold text-accent">{totalCompleted}</div>
          <div className="text-sm text-text-muted mt-1">Exercises completed</div>
        </div>
        <div className="p-5 rounded-xl bg-bg-card border border-border">
          <div className="text-3xl font-bold text-text-primary">{totalExercises}</div>
          <div className="text-sm text-text-muted mt-1">Total exercises</div>
        </div>
        <div className="p-5 rounded-xl bg-bg-card border border-border">
          <div className="text-3xl font-bold text-success">
            {totalExercises > 0 ? Math.round((totalCompleted / totalExercises) * 100) : 0}%
          </div>
          <div className="text-sm text-text-muted mt-1">Overall progress</div>
        </div>
      </div>

      {/* Module cards */}
      <h2 className="text-xl font-semibold mb-4">Modules</h2>
      <div className="space-y-4 mb-8">
        {moduleCards.map((mod) => {
          const exercises = getExercisesByModule(mod.slug);
          const completedCount = exercises.filter((e) => isCompleted(e.id)).length;
          const percent = exercises.length > 0 ? Math.round((completedCount / exercises.length) * 100) : 0;

          return (
            <div key={mod.slug} className="p-6 rounded-xl bg-bg-card border border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mod.icon}</span>
                  <div>
                    <h3 className="font-semibold text-text-primary">{mod.title}</h3>
                    <p className="text-sm text-text-muted">{mod.description}</p>
                  </div>
                </div>
                <span className="text-sm text-text-secondary">
                  {completedCount}/{exercises.length} exercises
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-bg-tertiary rounded-full mb-4 overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Lessons */}
              <div className="space-y-2">
                {mod.lessons.map((lesson) => {
                  const lessonCompleted = lesson.exerciseIds.filter((id) => isCompleted(id)).length;
                  const allDone = lessonCompleted === lesson.exerciseIds.length;

                  return (
                    <a
                      key={lesson.path}
                      href={lesson.path}
                      className="flex items-center justify-between px-4 py-3 rounded-lg bg-bg-secondary hover:bg-bg-hover border border-border transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                          allDone
                            ? 'bg-success/20 text-success'
                            : lessonCompleted > 0
                              ? 'bg-accent/20 text-accent'
                              : 'bg-bg-tertiary text-text-muted'
                        }`}>
                          {allDone ? '\u2713' : lessonCompleted > 0 ? lessonCompleted : '\u2022'}
                        </span>
                        <span className="text-sm text-text-primary">{lesson.title}</span>
                      </div>
                      <span className="text-xs text-text-muted">
                        {lessonCompleted}/{lesson.exerciseIds.length}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset */}
      {totalCompleted > 0 && (
        <button
          onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) {
              resetProgress();
            }
          }}
          className="text-xs text-text-muted hover:text-error transition-colors"
        >
          Reset all progress
        </button>
      )}
    </div>
  );
}
