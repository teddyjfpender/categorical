/**
 * HTTP client for the Haskell Playground API (play.haskell.org).
 */

export interface PlaygroundSuccessResponse {
  ec: number;
  ghcout: string;
  sout: string;
  serr: string;
  timesecs: number;
}

export interface PlaygroundErrorResponse {
  err: string;
}

export type PlaygroundResponse = PlaygroundSuccessResponse | PlaygroundErrorResponse;

export function isErrorResponse(r: PlaygroundResponse): r is PlaygroundErrorResponse {
  return 'err' in r;
}

export class RateLimitError extends Error {
  constructor() {
    super('Rate limited by Haskell Playground');
    this.name = 'RateLimitError';
  }
}

export class PlaygroundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PlaygroundError';
  }
}

/** Check if an error is a browser CORS block (TypeError with no response). */
export function isCorsError(e: unknown): boolean {
  return e instanceof TypeError && (e.message.includes('Failed to fetch') || e.message.includes('NetworkError'));
}

const PLAYGROUND_URL = 'https://play.haskell.org/submit';
const GHC_VERSION = '9.6.7';
const TIMEOUT_MS = 30_000;

/**
 * Submit Haskell code to the playground for compilation and execution.
 * If a proxyUrl is configured, the request is routed through it.
 */
export async function submitToPlayground(
  code: string,
  proxyUrl?: string,
): Promise<PlaygroundResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const url = proxyUrl || PLAYGROUND_URL;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        version: GHC_VERSION,
        opt: 'O0',
        output: 'run',
      }),
      signal: controller.signal,
    });

    if (response.status === 429) {
      throw new RateLimitError();
    }

    if (!response.ok) {
      throw new PlaygroundError(`HTTP ${response.status}`);
    }

    return (await response.json()) as PlaygroundResponse;
  } finally {
    clearTimeout(timeoutId);
  }
}
