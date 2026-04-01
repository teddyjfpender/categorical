export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  title: string;
  difficulty: Difficulty;
  order: number;
  description: string;
  starterCode: string;
  solutionCode: string;
  testCode: string;
  hints: string[];
  concepts: string[];
  /** Regex patterns that the user's code must match to pass (mock validation) */
  successPatterns: string[];
  /** Per-exercise test names and what they check */
  testNames: string[];
}

export interface TypeCheckResult {
  success: boolean;
  errors: CompilerError[];
  inferredTypes?: Record<string, string>;
}

export interface CompilerError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface TestCase {
  name: string;
  passed: boolean;
  message?: string;
}

export type ExecutionBackend = 'playground' | 'mock';

export interface TestRunResult {
  success: boolean;
  compilationErrors: CompilerError[];
  tests: TestCase[];
  output: string;
  executionTimeMs: number;
  backend: ExecutionBackend;
}
