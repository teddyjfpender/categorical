/**
 * Parses structured test output from the harness's stdout.
 */

import type { TestCase } from '../types/exercise';

const START_MARKER = '>>>TEST_RESULTS_START<<<';
const END_MARKER = '>>>TEST_RESULTS_END<<<';

export function parseTestOutput(stdout: string): TestCase[] {
  const startIdx = stdout.indexOf(START_MARKER);
  const endIdx = stdout.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) return [];

  const block = stdout.slice(startIdx + START_MARKER.length, endIdx).trim();
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
        tests.push({
          name: rest.slice(0, colonIdx),
          passed: false,
          message: rest.slice(colonIdx + 2),
        });
      } else {
        tests.push({ name: rest, passed: false });
      }
    }
  }

  return tests;
}
