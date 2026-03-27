import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedExercises: string[];
  exerciseCode: Record<string, string>;

  // Actions
  markCompleted: (exerciseId: string) => void;
  saveCode: (exerciseId: string, code: string) => void;
  getSavedCode: (exerciseId: string) => string | undefined;
  isCompleted: (exerciseId: string) => boolean;
  getModuleProgress: (moduleSlug: string, exerciseIds: string[]) => { completed: number; total: number };
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedExercises: [],
      exerciseCode: {},

      markCompleted: (exerciseId: string) => {
        set((state) => {
          if (state.completedExercises.includes(exerciseId)) return state;
          return { completedExercises: [...state.completedExercises, exerciseId] };
        });
      },

      saveCode: (exerciseId: string, code: string) => {
        set((state) => ({
          exerciseCode: { ...state.exerciseCode, [exerciseId]: code },
        }));
      },

      getSavedCode: (exerciseId: string) => {
        return get().exerciseCode[exerciseId];
      },

      isCompleted: (exerciseId: string) => {
        return get().completedExercises.includes(exerciseId);
      },

      getModuleProgress: (_moduleSlug: string, exerciseIds: string[]) => {
        const completed = exerciseIds.filter((id) => get().completedExercises.includes(id)).length;
        return { completed, total: exerciseIds.length };
      },

      resetProgress: () => {
        set({ completedExercises: [], exerciseCode: {} });
      },
    }),
    {
      name: 'categorical-progress',
    },
  ),
);
