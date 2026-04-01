import type { TestRunResult, Exercise } from '../types/exercise';
import { MockExecutor } from './mockExecutor';
import { PlaygroundExecutor } from './playgroundExecutor';

export interface ExecutionService {
  runTests(code: string, exercise: Exercise): Promise<TestRunResult>;
}

let currentService: ExecutionService | null = null;

export function setExecutionService(service: ExecutionService) {
  currentService = service;
}

export function getExecutionService(): ExecutionService {
  if (!currentService) {
    const fallback = new MockExecutor();
    // VITE_PLAYGROUND_PROXY_URL can be set in .env or at build time.
    // When set, all playground requests route through this CORS proxy.
    const proxyUrl = (import.meta as any).env?.VITE_PLAYGROUND_PROXY_URL as string | undefined;
    currentService = new PlaygroundExecutor(fallback, proxyUrl || undefined);
  }
  return currentService;
}
