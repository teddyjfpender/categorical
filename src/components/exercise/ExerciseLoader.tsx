import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ExerciseWorkspace } from './ExerciseWorkspace';
import { getExercise } from '../../lib/exercises';
import type { Exercise } from '../../lib/types/exercise';

/**
 * ExerciseLoader mounts into exercise placeholder divs in the MDX content.
 * It scans the DOM for elements with data-exercise attributes and renders
 * an ExerciseWorkspace for each one.
 */
export function ExerciseLoader() {
  const [exercises, setExercises] = useState<Array<{ id: string; exercise: Exercise; element: HTMLElement }>>([]);

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-exercise]');
    const loaded: Array<{ id: string; exercise: Exercise; element: HTMLElement }> = [];

    elements.forEach((el) => {
      const exerciseId = el.getAttribute('data-exercise');
      if (!exerciseId) return;

      const exercise = getExercise(exerciseId);
      if (!exercise) {
        console.warn(`Exercise not found: ${exerciseId}`);
        return;
      }

      loaded.push({ id: exerciseId, exercise, element: el });
    });

    setExercises(loaded);
  }, []);

  if (typeof window === 'undefined') return null;

  return (
    <>
      {exercises.map(({ id, exercise, element }) =>
        createPortal(<ExerciseWorkspace key={id} exercise={exercise} />, element),
      )}
    </>
  );
}
