import { useProgressStore } from '../../lib/stores/progressStore';
import { getExercisesByModule } from '../../lib/exercises';
import { tracks, modules as curriculumModules, type CurriculumModule, type TrackSlug } from '../../lib/curriculum';
import { href } from '../../lib/paths';

function ModuleCard({ mod }: { mod: CurriculumModule }) {
  const { isCompleted } = useProgressStore();
  const exercises = getExercisesByModule(mod.slug);
  const completedCount = exercises.filter((e) => isCompleted(e.id)).length;
  const totalCount = exercises.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isComingSoon = mod.status === 'coming-soon';
  const firstLessonPath = mod.lessons[0]?.path;

  const content = (
    <div className={`p-5 rounded-xl bg-bg-card border border-border transition-colors duration-150 ${
      isComingSoon ? 'opacity-50' : 'hover:border-border-bright hover:bg-bg-hover'
    }`}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl flex-shrink-0" aria-hidden="true">{mod.icon}</span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-text-primary">{mod.title}</h3>
            {isComingSoon && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-bg-tertiary text-text-muted uppercase tracking-wider font-medium">
                Coming soon
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary mt-1 leading-relaxed">{mod.description}</p>
        </div>
      </div>

      {/* Prerequisites */}
      {mod.prerequisites.length > 0 && (
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-[10px] text-text-muted">Requires:</span>
          {mod.prerequisites.map((prereq) => {
            const prereqMod = curriculumModules.find((m) => m.slug === prereq);
            return (
              <span key={prereq} className="text-[10px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted">
                {prereqMod?.title || prereq}
              </span>
            );
          })}
        </div>
      )}

      {/* Progress */}
      {!isComingSoon && (
        <>
          <div className="flex items-center justify-between text-xs text-text-muted mb-1.5">
            <span>{totalCount} exercises</span>
            <span>{completedCount}/{totalCount} completed</span>
          </div>
          <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </>
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
  const allExerciseCount = curriculumModules
    .filter((m) => m.status === 'available')
    .reduce((sum, m) => sum + m.lessons.flatMap((l) => l.exerciseIds).length, 0);
  const totalCompleted = completedExercises.length;

  const trackGroups = tracks.map((track) => ({
    track,
    modules: curriculumModules
      .filter((m) => m.track === track.slug)
      .sort((a, b) => a.order - b.order),
  }));

  return (
    <div>
      {/* Overall progress */}
      <div className="mb-10 p-6 rounded-xl bg-bg-card border border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Overall Progress</h2>
            <p className="text-sm text-text-secondary mt-0.5">
              {totalCompleted} of {allExerciseCount} exercises completed
            </p>
          </div>
          <span className="text-2xl font-bold text-accent">
            {allExerciseCount > 0 ? Math.round((totalCompleted / allExerciseCount) * 100) : 0}%
          </span>
        </div>
        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: allExerciseCount > 0 ? `${(totalCompleted / allExerciseCount) * 100}%` : '0%' }}
          />
        </div>
      </div>

      {/* Tracks */}
      <div className="space-y-10">
        {trackGroups.map(({ track, modules }) => (
          <div key={track.slug}>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-lg font-semibold text-text-primary">{track.title}</h2>
              <div className="flex-1 h-px bg-border" />
            </div>
            <p className="text-sm text-text-secondary mb-5">{track.description}</p>

            <div className="space-y-3">
              {modules.map((mod, i) => (
                <div key={mod.slug}>
                  {/* Connector line */}
                  {i > 0 && (
                    <div className="flex justify-center -mt-1 mb-1">
                      <div className="w-px h-4 bg-border" />
                    </div>
                  )}
                  <ModuleCard mod={mod} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
