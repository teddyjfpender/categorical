import { useState } from 'react';
import { useProgressStore } from '../../lib/stores/progressStore';
import { getExercisesByModule } from '../../lib/exercises';
import { tracks, modules as curriculumModules, type CurriculumModule } from '../../lib/curriculum';
import { href } from '../../lib/paths';
import type { Language } from '../../lib/types/exercise';

const LANGUAGES: { id: Language | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'haskell', label: 'Haskell' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'rust', label: 'Rust' },
  { id: 'cuda', label: 'CUDA' },
  { id: 'rocm', label: 'ROCm' },
];

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
      <span className="text-lg font-mono text-text-muted flex-shrink-0 w-6 text-center" aria-hidden="true">
        {mod.icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-text-primary truncate">{mod.title}</h3>
          {isComingSoon && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-bg-tertiary text-text-muted uppercase tracking-wider font-medium flex-shrink-0">Soon</span>
          )}
          {allDone && (
            <span className="text-success text-xs flex-shrink-0">{'\u2713'}</span>
          )}
        </div>
        <p className="text-xs text-text-muted truncate">{mod.description}</p>
      </div>
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
  return <a href={href(firstLessonPath)} className="block">{content}</a>;
}

export function SyllabusPage() {
  const { completedExercises } = useProgressStore();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | 'all'>('all');

  const filteredModules = selectedLanguage === 'all'
    ? curriculumModules
    : curriculumModules.filter((m) => m.language === selectedLanguage);

  const availableFiltered = filteredModules.filter((m) => m.status === 'available');
  const exerciseCount = availableFiltered.reduce(
    (sum, m) => sum + m.lessons.flatMap((l) => l.exerciseIds).length, 0,
  );
  const completedCount = completedExercises.filter((id) => {
    const mod = availableFiltered.find((m) =>
      m.lessons.some((l) => l.exerciseIds.includes(id)),
    );
    return !!mod;
  }).length;
  const overallPercent = exerciseCount > 0 ? Math.round((completedCount / exerciseCount) * 100) : 0;

  const trackGroups = tracks
    .sort((a, b) => a.order - b.order)
    .map((track) => ({
      track,
      modules: filteredModules
        .filter((m) => m.track === track.slug)
        .sort((a, b) => a.order - b.order),
    }))
    .filter(({ modules }) => modules.length > 0);

  // Count exercises per language for the filter pills
  const langCounts: Record<string, number> = { all: 0 };
  for (const mod of curriculumModules.filter((m) => m.status === 'available')) {
    const count = mod.lessons.flatMap((l) => l.exerciseIds).length;
    langCounts.all += count;
    langCounts[mod.language] = (langCounts[mod.language] || 0) + count;
  }

  return (
    <div>
      {/* Language filter */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {LANGUAGES.filter((l) => l.id === 'all' || (langCounts[l.id] || 0) > 0).map((lang) => (
          <button
            key={lang.id}
            onClick={() => setSelectedLanguage(lang.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
              selectedLanguage === lang.id
                ? 'bg-accent text-white'
                : 'bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-border-bright'
            }`}
          >
            {lang.label}
            <span className="ml-1.5 text-xs opacity-60">{langCounts[lang.id] || 0}</span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-4 mb-8 p-4 rounded-lg bg-bg-card border border-border">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-text-secondary">
              {completedCount} of {exerciseCount} exercises
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
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-sm font-medium text-text-muted uppercase tracking-wider">{track.title}</h2>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-text-muted tabular-nums">{trackExercises} exercises</span>
              </div>
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
