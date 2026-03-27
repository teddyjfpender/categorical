import type { TestRunResult, Exercise } from '../types/exercise';
import { MockExecutor } from './mockExecutor';

export interface ExecutionService {
  runTests(code: string, exercise: Exercise): Promise<TestRunResult>;
}

let currentService: ExecutionService | null = null;

export function setExecutionService(service: ExecutionService) {
  currentService = service;
}

export function getExecutionService(): ExecutionService {
  if (!currentService) {
    currentService = new MockExecutor();
  }
  return currentService;
}
