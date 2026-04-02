import { useProgressStore } from '../../lib/stores/progressStore';
import { getExercisesByModule } from '../../lib/exercises';
import { modules as curriculumModules } from '../../lib/curriculum';
import { href } from '../../lib/paths';

interface SidebarProps {
  currentModule: string;
  currentLesson: string;
}

export function Sidebar({ currentModule, currentLesson }: SidebarProps) {
  const { isCompleted } = useProgressStore();
  const availableModules = curriculumModules.filter((m) => m.status === 'available');

  return (
    <nav className="w-64 flex-shrink-0 border-r border-border bg-bg-secondary h-full overflow-y-auto">
      <div className="p-4">
        <a href={href('/')} className="flex items-center gap-2 text-lg font-semibold mb-6">
          <span className="text-accent">C</span>ategorical
        </a>

        <div className="space-y-6">
          {availableModules.map((mod) => {
            const exercises = getExercisesByModule(mod.slug);
            const completedCount = exercises.filter((e) => isCompleted(e.id)).length;
            const totalCount = exercises.length;

            return (
              <div key={mod.slug}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-medium text-text-muted uppercase tracking-wider">
                    {mod.title}
                  </h3>
                  <span className="text-xs text-text-muted">
                    {completedCount}/{totalCount}
                  </span>
                </div>

                <div className="h-1 bg-bg-tertiary rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-300"
                    style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
                  />
                </div>

                <ul className="space-y-1">
                  {mod.lessons.map((lesson) => {
                    const isActive = mod.slug === currentModule && lesson.slug === currentLesson;
                    const lessonCompleted = lesson.exerciseIds.filter((id) => isCompleted(id)).length;
                    const allDone = lessonCompleted === lesson.exerciseIds.length && lesson.exerciseIds.length > 0;

                    return (
                      <li key={lesson.slug}>
                        <a
                          href={href(lesson.path)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? 'bg-accent/10 text-accent border border-accent/20'
                              : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                          }`}
                        >
                          <span className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            allDone
                              ? 'bg-success/20 border-success/40 text-success'
                              : lessonCompleted > 0
                                ? 'bg-accent/20 border-accent/40 text-accent'
                                : 'border-border text-text-muted'
                          }`}>
                            {allDone ? '\u2713' : lessonCompleted > 0 ? lessonCompleted : ''}
                          </span>
                          <span className="truncate">{lesson.title}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
