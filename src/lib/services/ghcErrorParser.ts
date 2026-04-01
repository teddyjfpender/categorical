/**
 * Parses GHC compiler output into structured CompilerError[].
 */

import type { CompilerError } from '../types/exercise';

/**
 * Parse GHC error/warning output, adjusting line numbers by subtracting
 * the harness offset so they point to the user's code in the editor.
 */
export function parseGhcErrors(ghcout: string, lineOffset: number): CompilerError[] {
  if (!ghcout.trim()) return [];

  const errors: CompilerError[] = [];

  // GHC error format: <file>:<line>:<col>: error: [GHC-XXXXX] ...
  // or: <file>:<line>:<col>: warning: ...
  // Multi-line messages are indented below.
  const blocks = ghcout.split(/(?=^\S+:\d+:\d+:)/m).filter(Boolean);

  for (const block of blocks) {
    const headerMatch = block.match(/^[^:]+:(\d+):(\d+):\s*(error|warning)/);
    if (!headerMatch) continue;

    const rawLine = parseInt(headerMatch[1], 10);
    const column = parseInt(headerMatch[2], 10);
    const severity = headerMatch[3] as 'error' | 'warning';

    // Extract the message (everything after the first line)
    const lines = block.split('\n');
    const message = lines
      .slice(1)
      .map((l) => l.replace(/^\s{4}/, ''))
      .join('\n')
      .trim() || lines[0].replace(/^[^:]+:\d+:\d+:\s*(error|warning):\s*/, '').trim();

    errors.push({
      line: Math.max(1, rawLine - lineOffset),
      column,
      message,
      severity,
    });
  }

  return errors;
}
