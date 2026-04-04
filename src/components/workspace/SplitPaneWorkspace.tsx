import { useState, useCallback, useRef, useEffect } from 'react';
import { DescriptionPanel } from './DescriptionPanel';
import { EditorPanel } from './EditorPanel';
import { ExerciseNav } from './ExerciseNav';
import { ExerciseSidebar } from './ExerciseSidebar';
import { ResultModal } from '../ui/ResultModal';
import { getExecutionService } from '../../lib/services/executionService';
import { useProgressStore } from '../../lib/stores/progressStore';
import type { Exercise, TestRunResult } from '../../lib/types/exercise';

interface SplitPaneWorkspaceProps {
  exercises: Exercise[];
  lessonTitle: string;
  lessonContent: string;
  moduleTitle: string;
  moduleSlug: string;
  lessonSlug: string;
  initialExerciseIndex?: number;
}

// Lazy-init on client only to avoid SSR/hydration mismatch
let executor: ReturnType<typeof getExecutionService> | null = null;
function getExecutor() {
  if (!executor) executor = getExecutionService();
  return executor;
}

export function SplitPaneWorkspace({
  exercises,
  lessonTitle,
  lessonContent,
  moduleTitle,
  moduleSlug,
  lessonSlug,
  initialExerciseIndex = 0,
}: SplitPaneWorkspaceProps) {
  const { saveCode, getSavedCode, markCompleted, isCompleted } = useProgressStore();
  const [currentIndex, setCurrentIndex] = useState(initialExerciseIndex);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [splitPosition, setSplitPosition] = useState(50);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<TestRunResult | null>(null);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'hints' | 'solution'>('description');
  const [showResultModal, setShowResultModal] = useState(false);

  const exercise = exercises[currentIndex];
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Always start with starterCode during SSR/initial render to avoid hydration mismatch.
  // After mount, load saved code from localStorage if available.
  const [code, setCode] = useState(exercise.starterCode);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const saved = getSavedCode(exercise.id);
    if (saved) setCode(saved);
  }, []);

  // When switching exercises, load saved code
  const switchExercise = useCallback((index: number) => {
    // Save current code first
    saveCode(exercise.id, code);

    setCurrentIndex(index);
    const newExercise = exercises[index];
    setCode(getSavedCode(newExercise.id) || newExercise.starterCode);
    setResult(null);
    setRevealedHints(0);
    setShowSolution(false);
    setActiveLeftTab('description');
  }, [exercise.id, exercises, code, saveCode, getSavedCode]);

  // Save code on change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveCode(exercise.id, code);
    }, 500);
    return () => clearTimeout(timer);
  }, [code, exercise.id, saveCode]);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const testResult = await getExecutor().runTests(code, exercise);
      setResult(testResult);
      if (testResult.success) {
        markCompleted(exercise.id);
      }
    } catch {
      setResult({
        success: false,
        compilationErrors: [{ line: 1, column: 1, message: 'Unexpected error', severity: 'error' }],
        tests: [],
        output: 'Error',
        executionTimeMs: 0,
        backend: 'mock',
      });
    } finally {
      setIsRunning(false);
      setShowResultModal(true);
    }
  }, [code, exercise, markCompleted]);

  const handleReset = useCallback(() => {
    setCode(exercise.starterCode);
    setResult(null);
    setRevealedHints(0);
    setShowSolution(false);
    saveCode(exercise.id, exercise.starterCode);
  }, [exercise.starterCode, exercise.id, saveCode]);

  // Resizable split pane
  const handleMouseDown = useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPosition(Math.max(25, Math.min(75, percent)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const completed = isCompleted(exercise.id);

  return (
    <div className="h-screen flex flex-col bg-bg-primary text-text-primary overflow-hidden">
      {/* Top navigation bar */}
      <ExerciseNav
        moduleTitle={moduleTitle}
        lessonTitle={lessonTitle}
        exerciseTitle={exercise.title}
        difficulty={exercise.difficulty}
        currentIndex={currentIndex}
        totalExercises={exercises.length}
        completed={completed}
        isRunning={isRunning}
        onRun={handleRun}
        onPrev={() => currentIndex > 0 && switchExercise(currentIndex - 1)}
        onNext={() => currentIndex < exercises.length - 1 && switchExercise(currentIndex + 1)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Exercise sidebar */}
        {sidebarOpen && (
          <ExerciseSidebar
            exercises={exercises}
            currentIndex={currentIndex}
            onSelect={switchExercise}
            moduleSlug={moduleSlug}
            lessonSlug={lessonSlug}
          />
        )}

        {/* Split pane content */}
        <div ref={containerRef} className="flex-1 flex overflow-hidden">
          {/* Left panel — description */}
          <div style={{ width: `${splitPosition}%` }} className="flex flex-col overflow-hidden">
            <DescriptionPanel
              exercise={exercise}
              lessonContent={lessonContent}
              activeTab={activeLeftTab}
              onTabChange={setActiveLeftTab}
              revealedHints={revealedHints}
              onRevealHint={() => setRevealedHints((h) => Math.min(h + 1, exercise.hints.length))}
              showSolution={showSolution}
              onShowSolution={() => setShowSolution(true)}
              result={result}
            />
          </div>

          {/* Resizable divider */}
          <div
            onMouseDown={handleMouseDown}
            className="w-1.5 bg-border hover:bg-accent/50 cursor-col-resize flex-shrink-0 transition-colors duration-150"
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize panels"
          />

          {/* Right panel — editor + output */}
          <div style={{ width: `${100 - splitPosition}%` }} className="flex flex-col overflow-hidden">
            <EditorPanel
              code={code}
              onChange={setCode}
              onRun={handleRun}
              onReset={handleReset}
              result={result}
              isRunning={isRunning}
              completed={completed}
              language={exercise.language}
            />
          </div>
        </div>
      </div>

      {/* Result modal — shows after each run */}
      {result && (
        <ResultModal
          open={showResultModal}
          result={result}
          exerciseTitle={exercise.title}
          nextExerciseTitle={
            currentIndex < exercises.length - 1
              ? exercises[currentIndex + 1].title
              : undefined
          }
          onClose={() => setShowResultModal(false)}
          onNextExercise={
            currentIndex < exercises.length - 1
              ? () => switchExercise(currentIndex + 1)
              : undefined
          }
        />
      )}
    </div>
  );
}
