import type { TestRunResult, Exercise, Language } from '../types/exercise';
import { MockExecutor } from './mockExecutor';
import { PlaygroundExecutor } from './playgroundExecutor';
import { RustPlaygroundExecutor } from './backends/rust';

export interface ExecutionService {
  runTests(code: string, exercise: Exercise): Promise<TestRunResult>;
}

const fallback = new MockExecutor();

// Per-language executor cache
const executors: Partial<Record<Language, ExecutionService>> = {};

function getHaskellExecutor(): ExecutionService {
  if (!executors.haskell) {
    const proxyUrl = (import.meta as any).env?.PUBLIC_PLAYGROUND_PROXY_URL as string | undefined;
    executors.haskell = new PlaygroundExecutor(fallback, proxyUrl || undefined);
  }
  return executors.haskell;
}

function getRustExecutor(): ExecutionService {
  if (!executors.rust) {
    executors.rust = new RustPlaygroundExecutor(fallback);
  }
  return executors.rust;
}

/**
 * Get the execution service for a given language.
 * Falls back to MockExecutor for languages without a playground backend.
 */
export function getExecutionService(language: Language = 'haskell'): ExecutionService {
  switch (language) {
    case 'haskell': return getHaskellExecutor();
    case 'rust': return getRustExecutor();
    // TypeScript, CUDA, ROCm fall back to mock for now
    default: return fallback;
  }
}
