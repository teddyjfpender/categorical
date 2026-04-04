/**
 * Rust Playground backend (play.rust-lang.org).
 * CORS is fully supported — no proxy needed.
 */

import type { CompilerError, TestCase, TestRunResult, Exercise } from '../../types/exercise';
import type { ExecutionService } from '../executionService';
import { MockExecutor } from '../mockExecutor';

const RUST_PLAYGROUND_URL = 'https://play.rust-lang.org/execute';
const TIMEOUT_MS = 30_000;

const TEST_START = '>>>TEST_RESULTS_START<<<';
const TEST_END = '>>>TEST_RESULTS_END<<<';

/** Rust test harness template. User code is injected at the marker. */
function combineRustCode(userCode: string, testCode: string): { combined: string; userCodeLineOffset: number } {
  const harness = `// <<<USER_CODE>>>

fn assert_test_eq<T: std::fmt::Debug + PartialEq>(name: &str, expected: T, actual: T) {
    if expected == actual {
        println!("PASS: {}", name);
    } else {
        println!("FAIL: {}: Expected {:?} but got {:?}", name, expected, actual);
    }
}

fn assert_test(name: &str, passed: bool) {
    if passed {
        println!("PASS: {}", name);
    } else {
        println!("FAIL: {}: assertion failed", name);
    }
}

fn main() {
    println!("${TEST_START}");
    // <<<TEST_ASSERTIONS>>>
    println!("${TEST_END}");
}
`;

  const strippedUser = userCode.replace(/^fn main\s*\(\)\s*\{[\s\S]*\}\s*$/m, '').trim();
  const beforeMarker = harness.split('// <<<USER_CODE>>>')[0];
  const userCodeLineOffset = beforeMarker.split('\n').length - 1;

  const combined = harness
    .replace('// <<<USER_CODE>>>', strippedUser)
    .replace('// <<<TEST_ASSERTIONS>>>', testCode.trim());

  return { combined, userCodeLineOffset };
}

function parseRustErrors(stderr: string, lineOffset: number): CompilerError[] {
  const errors: CompilerError[] = [];
  // Rust error format: error[E0XXX]: message
  //   --> src/main.rs:LINE:COL
  const blocks = stderr.split(/(?=error\[|error:)/);

  for (const block of blocks) {
    const lineMatch = block.match(/--> [^:]+:(\d+):(\d+)/);
    const msgMatch = block.match(/^(error(?:\[E\d+\])?): (.+)/);
    if (lineMatch && msgMatch) {
      const rawLine = parseInt(lineMatch[1], 10);
      errors.push({
        line: Math.max(1, rawLine - lineOffset),
        column: parseInt(lineMatch[2], 10),
        message: msgMatch[2],
        severity: 'error',
      });
    }
  }

  return errors;
}

function parseTestOutput(stdout: string): TestCase[] {
  const startIdx = stdout.indexOf(TEST_START);
  const endIdx = stdout.indexOf(TEST_END);
  if (startIdx === -1 || endIdx === -1) return [];

  const block = stdout.slice(startIdx + TEST_START.length, endIdx).trim();
  if (!block) return [];

  const tests: TestCase[] = [];
  for (const line of block.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('PASS: ')) {
      tests.push({ name: trimmed.slice(6), passed: true });
    } else if (trimmed.startsWith('FAIL: ')) {
      const rest = trimmed.slice(6);
      const colonIdx = rest.indexOf(': ');
      if (colonIdx !== -1) {
        tests.push({ name: rest.slice(0, colonIdx), passed: false, message: rest.slice(colonIdx + 2) });
      } else {
        tests.push({ name: rest, passed: false });
      }
    }
  }
  return tests;
}

export class RustPlaygroundExecutor implements ExecutionService {
  private fallback: MockExecutor;

  constructor(fallback: MockExecutor) {
    this.fallback = fallback;
  }

  async runTests(code: string, exercise: Exercise): Promise<TestRunResult> {
    if (!exercise.testCode.trim()) {
      return this.fallback.runTests(code, exercise);
    }

    const { combined, userCodeLineOffset } = combineRustCode(code, exercise.testCode);
    const startTime = performance.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const response = await fetch(RUST_PLAYGROUND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'stable',
          mode: 'debug',
          edition: '2021',
          crateType: 'bin',
          tests: false,
          code: combined,
          backtrace: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.status === 429) {
        return {
          success: false,
          compilationErrors: [],
          tests: [{ name: 'rate limit', passed: false, message: 'Rust Playground is rate-limited. Wait a moment.' }],
          output: 'Rate limited',
          executionTimeMs: Math.round(performance.now() - startTime),
          backend: 'playground',
        };
      }

      const data = await response.json();
      const executionTimeMs = Math.round(performance.now() - startTime);

      if (!data.success) {
        const errors = parseRustErrors(data.stderr || '', userCodeLineOffset);
        if (errors.length > 0) {
          return {
            success: false,
            compilationErrors: errors,
            tests: [],
            output: data.stderr || '',
            executionTimeMs,
            backend: 'playground',
          };
        }
        // Runtime error
        const tests = parseTestOutput(data.stdout || '');
        return {
          success: false,
          compilationErrors: [],
          tests: tests.length > 0
            ? tests
            : [{ name: 'runtime', passed: false, message: (data.stderr || 'Runtime error').slice(0, 200) }],
          output: (data.stdout || '') + '\n' + (data.stderr || ''),
          executionTimeMs,
          backend: 'playground',
        };
      }

      // Success
      const tests = parseTestOutput(data.stdout || '');
      const allPassed = tests.length > 0 && tests.every((t) => t.passed);

      return {
        success: allPassed,
        compilationErrors: [],
        tests,
        output: data.stdout || '',
        executionTimeMs,
        backend: 'playground',
      };
    } catch (e) {
      // Network error or CORS (unlikely for Rust playground)
      return this.fallback.runTests(code, exercise);
    }
  }
}
