import type { ExecutionService } from './executionService';
import type { TestRunResult, CompilerError, TestCase, Exercise } from '../types/exercise';

export class MockExecutor implements ExecutionService {
  /**
   * Run tests against user code using the exercise's successPatterns.
   * Each pattern is tested as a regex against the code. The test names
   * come from exercise.testNames to give meaningful feedback.
   */
  async runTests(code: string, exercise: Exercise): Promise<TestRunResult> {
    // Simulate compilation delay
    await new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 400));

    // Check for syntax-level errors first
    const errors = this.checkForCommonErrors(code);
    if (errors.length > 0) {
      return {
        success: false,
        compilationErrors: errors,
        tests: [],
        output: errors.map((e) => `${e.line}:${e.column}: ${e.message}`).join('\n'),
        executionTimeMs: 87,
        backend: 'mock',
      };
    }

    // Check if the code still has placeholder error calls from the starter code.
    // We extract the exact error strings from the starter so we don't flag
    // legitimate uses of `error` (e.g., `error "empty list"`).
    const placeholders = this.findPlaceholderErrors(exercise.starterCode);
    const remaining = placeholders.filter((p) => code.includes(p));

    if (remaining.length > 0) {
      return {
        success: false,
        compilationErrors: [],
        tests: [
          {
            name: 'implementation complete',
            passed: false,
            message: `${remaining.length} placeholder(s) still present — replace them with your implementation`,
          },
        ],
        output: remaining.map((p) => `Still contains: ${p}`).join('\n'),
        executionTimeMs: 94,
        backend: 'mock',
      };
    }

    // Run per-exercise pattern validation.
    // Strip comment lines so patterns only match real code.
    const uncommented = code
      .split('\n')
      .filter((line) => !line.trimStart().startsWith('--'))
      .join('\n');
    const tests: TestCase[] = [];
    const patterns = exercise.successPatterns;
    const names = exercise.testNames;

    for (let i = 0; i < patterns.length; i++) {
      const regex = new RegExp(patterns[i]);
      const passed = regex.test(uncommented);
      tests.push({
        name: names[i] || `check ${i + 1}`,
        passed,
        message: passed ? undefined : 'Expected pattern not found in your code',
      });
    }

    const allPassed = tests.every((t) => t.passed);

    return {
      success: allPassed,
      compilationErrors: [],
      tests,
      output: allPassed
        ? 'All tests passed!'
        : `${tests.filter((t) => !t.passed).length} of ${tests.length} checks failed.`,
      executionTimeMs: 150 + Math.floor(Math.random() * 100),
      backend: 'mock',
    };
  }

  /**
   * Extract placeholder error strings from starter code.
   * Matches `error "..."` calls that look like exercise placeholders
   * (e.g., `error "implement swap"`) but not real error handling
   * (e.g., `error "empty list"`).
   */
  private findPlaceholderErrors(starterCode: string): string[] {
    const matches = starterCode.match(/error\s*"[^"]*"/g) || [];
    // Only treat as placeholder if the message suggests it's a TODO
    const placeholderKeywords = /implement|handle|todo|fixme|replace|compare|your code/i;
    return matches.filter((m) => placeholderKeywords.test(m));
  }

  private checkForCommonErrors(code: string): CompilerError[] {
    const errors: CompilerError[] = [];
    const lines = code.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trimStart().startsWith('--')) continue;

      const opens = (line.match(/\(/g) || []).length;
      const closes = (line.match(/\)/g) || []).length;
      if (opens > closes + 3) {
        errors.push({
          line: i + 1,
          column: line.lastIndexOf('(') + 1,
          message: 'Possible unmatched parenthesis',
          severity: 'error',
        });
      }
    }

    return errors;
  }
}
