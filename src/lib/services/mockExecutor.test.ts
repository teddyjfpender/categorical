import { MockExecutor } from './mockExecutor';
import { getAllExercises } from '../exercises';

/**
 * Verify that every exercise's solution passes its own mock tests.
 * Run with: pnpm test
 */
async function runAllSolutionTests() {
  const executor = new MockExecutor();
  const exercises = getAllExercises();
  let passed = 0;
  let failed = 0;

  for (const exercise of exercises) {
    const result = await executor.runTests(exercise.solutionCode, exercise);

    if (result.success) {
      console.log(`  \x1b[32m\u2713\x1b[0m ${exercise.id}`);
      passed++;
    } else {
      console.log(`  \x1b[31m\u2717\x1b[0m ${exercise.id}`);
      failed++;

      // Show what failed
      for (const test of result.tests) {
        if (!test.passed) {
          console.log(`    \x1b[31m- ${test.name}: ${test.message}\x1b[0m`);
        }
      }
      if (result.compilationErrors.length > 0) {
        for (const err of result.compilationErrors) {
          console.log(`    \x1b[31m- ${err.line}:${err.column} ${err.message}\x1b[0m`);
        }
      }
    }
  }

  console.log(`\n${passed + failed} exercises, ${passed} passed, ${failed} failed\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

// Also verify that starter code does NOT pass (exercises should start failing)
async function runAllStarterTests() {
  const executor = new MockExecutor();
  const exercises = getAllExercises();
  let correctlyFailing = 0;
  let incorrectlyPassing = 0;

  for (const exercise of exercises) {
    const result = await executor.runTests(exercise.starterCode, exercise);

    if (!result.success) {
      console.log(`  \x1b[32m\u2713\x1b[0m ${exercise.id} (correctly fails with starter code)`);
      correctlyFailing++;
    } else {
      console.log(`  \x1b[31m\u2717\x1b[0m ${exercise.id} (incorrectly passes with starter code!)`);
      incorrectlyPassing++;
    }
  }

  console.log(`\n${correctlyFailing + incorrectlyPassing} exercises, ${correctlyFailing} correctly failing, ${incorrectlyPassing} incorrectly passing\n`);

  if (incorrectlyPassing > 0) {
    process.exit(1);
  }
}

async function main() {
  console.log('\nVerifying solutions pass all tests:\n');
  await runAllSolutionTests();

  console.log('Verifying starter code fails all tests:\n');
  await runAllStarterTests();

  console.log('\x1b[32mAll checks passed.\x1b[0m\n');
}

main();
