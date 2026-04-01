/**
 * Executes Haskell code via the Haskell Playground (play.haskell.org).
 * Falls back to MockExecutor on CORS block, network errors, or missing testCode.
 */

import type { ExecutionService } from './executionService';
import type { MockExecutor } from './mockExecutor';
import type { Exercise, TestRunResult } from '../types/exercise';
import { submitToPlayground, isErrorResponse, isCorsError, RateLimitError } from './playgroundApi';
import { combineCode } from './codeCombiner';
import { parseGhcErrors } from './ghcErrorParser';
import { parseTestOutput } from './testOutputParser';

export class PlaygroundExecutor implements ExecutionService {
  private fallback: MockExecutor;
  private corsBlocked = false;
  private proxyUrl?: string;

  constructor(fallback: MockExecutor, proxyUrl?: string) {
    this.fallback = fallback;
    this.proxyUrl = proxyUrl;
  }

  async runTests(code: string, exercise: Exercise): Promise<TestRunResult> {
    // No test code → use mock validation
    if (!exercise.testCode.trim()) {
      return this.fallback.runTests(code, exercise);
    }

    // CORS previously blocked → don't retry
    if (this.corsBlocked) {
      return this.fallback.runTests(code, exercise);
    }

    const { combined, userCodeLineOffset } = combineCode(code, exercise.testCode);
    const startTime = performance.now();

    try {
      const response = await submitToPlayground(combined, this.proxyUrl);

      if (isErrorResponse(response)) {
        return {
          success: false,
          compilationErrors: [{ line: 1, column: 1, message: response.err, severity: 'error' }],
          tests: [],
          output: response.err,
          executionTimeMs: Math.round(performance.now() - startTime),
          backend: 'playground',
        };
      }

      const executionTimeMs = Math.round(response.timesecs * 1000);

      // Compilation error
      if (response.ec === 2 || (response.ghcout && response.ec !== 0)) {
        const errors = parseGhcErrors(response.ghcout, userCodeLineOffset);
        return {
          success: false,
          compilationErrors: errors.length > 0
            ? errors
            : [{ line: 1, column: 1, message: response.ghcout || 'Compilation failed', severity: 'error' }],
          tests: [],
          output: response.ghcout,
          executionTimeMs,
          backend: 'playground',
        };
      }

      // Runtime error
      if (response.ec === 1) {
        const tests = parseTestOutput(response.sout);
        const errorMsg = response.serr.trim() || 'Runtime error';
        return {
          success: false,
          compilationErrors: [],
          tests: tests.length > 0
            ? tests
            : [{ name: 'runtime', passed: false, message: errorMsg }],
          output: response.sout + (response.serr ? '\n' + response.serr : ''),
          executionTimeMs,
          backend: 'playground',
        };
      }

      // Success — parse test output
      const tests = parseTestOutput(response.sout);
      const allPassed = tests.length > 0 && tests.every((t) => t.passed);

      return {
        success: allPassed,
        compilationErrors: [],
        tests,
        output: response.sout,
        executionTimeMs,
        backend: 'playground',
      };
    } catch (e) {
      if (isCorsError(e)) {
        this.corsBlocked = true;
        return this.fallback.runTests(code, exercise);
      }

      if (e instanceof RateLimitError) {
        return {
          success: false,
          compilationErrors: [],
          tests: [{ name: 'rate limit', passed: false, message: 'The Haskell Playground is rate-limited. Wait a moment and try again.' }],
          output: 'Rate limited',
          executionTimeMs: Math.round(performance.now() - startTime),
          backend: 'playground',
        };
      }

      // Network error, timeout, etc. — fall back
      return this.fallback.runTests(code, exercise);
    }
  }
}
