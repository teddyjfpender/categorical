import { useProgressStore } from '../../lib/stores/progressStore';
import { getExercisesByModule } from '../../lib/exercises';
import { tracks, modules as curriculumModules, type CurriculumModule } from '../../lib/curriculum';
import { href } from '../../lib/paths';

function ModuleRow({ mod }: { mod: CurriculumModule }) {
  const { isCompleted } = useProgressStore();
  const exercises = getExercisesByModule(mod.slug);
  const completedCount = exercises.filter((e) => isCompleted(e.id)).length;
  const totalCount = exercises.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isComingSoon = mod.status === 'coming-soon';
  const firstLessonPath = mod.lessons[0]?.path;
  const allDone = completedCount === totalCount && totalCount > 0;

  const content = (
    <div className={`flex items-center gap-4 p-4 rounded-lg border transition-colors duration-150 ${
      isComingSoon
        ? 'border-border/50 opacity-40'
        : allDone
          ? 'border-success/20 bg-success/5 hover:border-success/30'
          : 'border-border bg-bg-card hover:border-border-bright hover:bg-bg-hover'
    }`}>
      {/* Icon */}
      <span className="text-lg font-mono text-text-muted flex-shrink-0 w-6 text-center" aria-hidden="true">
        {mod.icon}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-text-primary truncate">{mod.title}</h3>
          {isComingSoon && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted uppercase tracking-wider font-medium flex-shrink-0">
              Soon
            </span>
          )}
          {allDone && (
            <span className="text-success text-xs flex-shrink-0">{'\u2713'}</span>
          )}
        </div>
        <p className="text-xs text-text-muted truncate">{mod.description}</p>
      </div>

      {/* Progress */}
      {!isComingSoon && (
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-20">
            <div className="h-1 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${allDone ? 'bg-success' : 'bg-accent'}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          <span className="text-xs text-text-muted tabular-nums w-12 text-right">
            {completedCount}/{totalCount}
          </span>
        </div>
      )}
    </div>
  );

  if (isComingSoon || !firstLessonPath) return content;

  return (
    <a href={href(firstLessonPath)} className="block">
      {content}
    </a>
  );
}

export function SyllabusPage() {
  const { completedExercises } = useProgressStore();
  const availableModules = curriculumModules.filter((m) => m.status === 'available');
  const allExerciseCount = availableModules.reduce(
    (sum, m) => sum + m.lessons.flatMap((l) => l.exerciseIds).length, 0,
  );
  const totalCompleted = completedExercises.length;
  const overallPercent = allExerciseCount > 0 ? Math.round((totalCompleted / allExerciseCount) * 100) : 0;

  const trackGroups = tracks
    .sort((a, b) => a.order - b.order)
    .map((track) => ({
      track,
      modules: curriculumModules
        .filter((m) => m.track === track.slug)
        .sort((a, b) => a.order - b.order),
    }))
    .filter(({ modules }) => modules.length > 0);

  return (
    <div>
      {/* Overall progress — compact bar */}
      <div className="flex items-center gap-4 mb-10 p-4 rounded-lg bg-bg-card border border-border">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-text-secondary">
              {totalCompleted} of {allExerciseCount} exercises
            </span>
            <span className="text-sm font-medium text-accent tabular-nums">{overallPercent}%</span>
          </div>
          <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div className="space-y-8">
        {trackGroups.map(({ track, modules }) => {
          const trackExercises = modules
            .filter((m) => m.status === 'available')
            .reduce((sum, m) => sum + m.lessons.flatMap((l) => l.exerciseIds).length, 0);

          return (
            <div key={track.slug}>
              {/* Track header */}
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider">{track.title}</h2>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-text-muted tabular-nums">{trackExercises} exercises</span>
              </div>

              {/* Module list */}
              <div className="space-y-1.5 mt-3">
                {modules.map((mod) => (
                  <ModuleRow key={mod.slug} mod={mod} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
