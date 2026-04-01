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
    // PUBLIC_PLAYGROUND_PROXY_URL is set in .env or as a GitHub secret.
    // Astro exposes PUBLIC_ prefixed vars to client-side code at build time.
    const proxyUrl = (import.meta as any).env?.PUBLIC_PLAYGROUND_PROXY_URL as string | undefined;
    currentService = new PlaygroundExecutor(fallback, proxyUrl || undefined);
  }
  return currentService;
}
