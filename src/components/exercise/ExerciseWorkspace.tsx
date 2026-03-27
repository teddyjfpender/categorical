import { useState, useCallback, useEffect } from 'react';
import { CodeEditor } from '../editor/CodeEditor';
import { OutputPanel } from '../editor/OutputPanel';
import { ExerciseControls } from './ExerciseControls';
import { HintAccordion } from './HintAccordion';
import { SolutionReveal } from './SolutionReveal';
import { TestResults } from './TestResults';
import { MockExecutor } from '../../lib/services/mockExecutor';
import { useProgressStore } from '../../lib/stores/progressStore';
import type { Exercise, TestRunResult } from '../../lib/types/exercise';

interface ExerciseWorkspaceProps {
  exercise: Exercise;
}

type ExerciseState = 'idle' | 'editing' | 'running' | 'success' | 'failure';

const executor = new MockExecutor();

export function ExerciseWorkspace({ exercise }: ExerciseWorkspaceProps) {
  const { saveCode, getSavedCode, markCompleted, isCompleted } = useProgressStore();

  const [code, setCode] = useState(() => {
    return getSavedCode(exercise.id) || exercise.starterCode;
  });
  const [state, setState] = useState<ExerciseState>(() => {
    return isCompleted(exercise.id) ? 'success' : 'idle';
  });
  const [result, setResult] = useState<TestRunResult | null>(null);
  const [revealedHints, setRevealedHints] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  // Save code on change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      saveCode(exercise.id, code);
    }, 500);
    return () => clearTimeout(timer);
  }, [code, exercise.id, saveCode]);

  const handleRun = useCallback(async () => {
    setState('running');
    setResult(null);

    try {
      const testResult = await executor.runTests(code, exercise);
      setResult(testResult);

      if (testResult.success) {
        setState('success');
        markCompleted(exercise.id);
      } else {
        setState('failure');
      }
    } catch {
      setState('failure');
      setResult({
        success: false,
        compilationErrors: [{ line: 1, column: 1, message: 'Unexpected error running tests', severity: 'error' }],
        tests: [],
        output: 'Error',
        executionTimeMs: 0,
      });
    }
  }, [code, exercise.id, exercise.testCode, markCompleted]);

  const handleReset = useCallback(() => {
    setCode(exercise.starterCode);
    setState('idle');
    setResult(null);
    setRevealedHints(0);
    setShowSolution(false);
  }, [exercise.starterCode]);

  const handleRevealHint = useCallback(() => {
    setRevealedHints((prev) => Math.min(prev + 1, exercise.hints.length));
  }, [exercise.hints.length]);

  const handleShowSolution = useCallback(() => {
    setShowSolution(true);
  }, []);

  const handleLoadSolution = useCallback(() => {
    setCode(exercise.solutionCode);
  }, [exercise.solutionCode]);

  const difficultyColors = {
    beginner: 'bg-success/20 text-success',
    intermediate: 'bg-warning/20 text-warning',
    advanced: 'bg-error/20 text-error',
  };

  const completed = isCompleted(exercise.id);

  return (
    <div className="my-8 rounded-xl border border-border bg-bg-card overflow-hidden">
      {/* Exercise Header */}
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          {completed && <span className="text-success text-lg">{'\u2713'}</span>}
          <h3 className="font-semibold text-text-primary">{exercise.title}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[exercise.difficulty]}`}>
            {exercise.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {exercise.concepts.map((concept) => (
            <span key={concept} className="px-2 py-0.5 rounded text-xs bg-bg-tertiary text-text-muted">
              {concept}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="px-6 py-4 border-b border-border">
        <p className="text-sm text-text-secondary leading-relaxed">{exercise.description}</p>
      </div>

      {/* Editor */}
      <div className="p-4">
        <CodeEditor
          value={code}
          onChange={setCode}
          onRun={handleRun}
          className="min-h-[200px]"
        />
      </div>

      {/* Controls */}
      <div className="px-4 pb-4">
        <ExerciseControls
          onRun={handleRun}
          onReset={handleReset}
          onHint={handleRevealHint}
          onSolution={handleShowSolution}
          isRunning={state === 'running'}
          hasMoreHints={revealedHints < exercise.hints.length}
          completed={completed}
        />
      </div>

      {/* Output */}
      <div className="px-4 pb-4">
        <OutputPanel result={result} isRunning={state === 'running'} />
      </div>

      {/* Success message */}
      {state === 'success' && result?.success && (
        <TestResults success={true} />
      )}

      {/* Hints */}
      {revealedHints > 0 && (
        <div className="px-4 pb-4">
          <HintAccordion hints={exercise.hints.slice(0, revealedHints)} />
        </div>
      )}

      {/* Solution */}
      {showSolution && (
        <div className="px-4 pb-4">
          <SolutionReveal
            solutionCode={exercise.solutionCode}
            onLoadSolution={handleLoadSolution}
          />
        </div>
      )}
    </div>
  );
}
