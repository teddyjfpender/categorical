import type { Exercise } from '../types/exercise';
import { getExerciseIdsForModule } from '../curriculum';

import { exercises as readingHaskell } from './reading-haskell';
import { exercises as typeSystems } from './type-systems';
import { exercises as categoryTheory } from './category-theory';
import { exercises as monoidsFoldable } from './monoids-foldable';
import { exercises as applicativeMonad } from './applicative-monad';
import { exercises as abstractAlgebra } from './abstract-algebra';
import { exercises as functionalAlgorithms } from './functional-algorithms';
import { exercises as algebraicCryptography } from './algebraic-cryptography';
import { exercises as compilerLanguageTheory } from './compiler-language-theory';
import { exercises as verifiedCryptographicProtocols } from './verified-cryptographic-protocols';
import { exercises as appliedCategoryTheory } from './applied-category-theory';
import { exercises as typedLinearAlgebra } from './typed-linear-algebra';
import { exercises as lambdaCalculusI } from './lambda-calculus-i';
import { exercises as lambdaCalculusII } from './lambda-calculus-ii';
import { exercises as lambdaCalculusIII } from './lambda-calculus-iii';
import { exercises as typescript } from './typescript';
import { exercises as rust } from './rust';
import { exercises as cuda } from './cuda';
import { exercises as rocm } from './rocm';

const allExercises: Record<string, Exercise> = {
  ...readingHaskell,
  ...typeSystems,
  ...categoryTheory,
  ...monoidsFoldable,
  ...applicativeMonad,
  ...abstractAlgebra,
  ...functionalAlgorithms,
  ...algebraicCryptography,
  ...compilerLanguageTheory,
  ...verifiedCryptographicProtocols,
  ...appliedCategoryTheory,
  ...typedLinearAlgebra,
  ...lambdaCalculusI,
  ...lambdaCalculusII,
  ...lambdaCalculusIII,
  ...typescript,
  ...rust,
  ...cuda,
  ...rocm,
};

export function getExercise(id: string): Exercise | undefined {
  return allExercises[id];
}

export function getExercisesByModule(moduleSlug: string): Exercise[] {
  const ids = getExerciseIdsForModule(moduleSlug);
  return ids.map((id) => allExercises[id]).filter(Boolean);
}

export function getAllExercises(): Exercise[] {
  return Object.values(allExercises);
}

export function getExerciseIds(): string[] {
  return Object.keys(allExercises);
}
