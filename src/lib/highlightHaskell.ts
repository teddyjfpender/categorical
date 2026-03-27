/**
 * Lightweight Haskell syntax highlighter for static code blocks.
 * Imports colors from the shared theme so editor and prose stay in sync.
 */

import { syntax } from './theme';

const KEYWORDS = new Set([
  'module', 'where', 'import', 'qualified', 'as', 'hiding',
  'data', 'type', 'newtype', 'class', 'instance', 'deriving',
  'do', 'let', 'in', 'case', 'of', 'if', 'then', 'else',
  'forall', 'infixl', 'infixr', 'infix', 'default', 'foreign',
]);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function span(color: string, text: string, italic = false): string {
  const style = italic ? `color:${color};font-style:italic` : `color:${color}`;
  return `<span style="${style}">${escapeHtml(text)}</span>`;
}

export function highlightHaskell(code: string): string {
  const lines = code.split('\n');
  return lines.map(highlightLine).join('\n');
}

function highlightLine(line: string): string {
  let result = '';
  let i = 0;

  while (i < line.length) {
    // Line comment
    if (line[i] === '-' && line[i + 1] === '-') {
      result += span(syntax.comment, line.slice(i), true);
      return result;
    }

    // String literal
    if (line[i] === '"') {
      let j = i + 1;
      while (j < line.length) {
        if (line[j] === '\\') { j += 2; continue; }
        if (line[j] === '"') { j++; break; }
        j++;
      }
      result += span(syntax.string, line.slice(i, j));
      i = j;
      continue;
    }

    // Char literal
    if (line[i] === "'" && i + 1 < line.length && line[i + 1] !== ' ') {
      let j = i + 1;
      if (j < line.length && line[j] === '\\') j++;
      if (j < line.length) j++;
      if (j < line.length && line[j] === "'") {
        j++;
        result += span(syntax.string, line.slice(i, j));
        i = j;
        continue;
      }
    }

    // Number
    if (/\d/.test(line[i]) && (i === 0 || /[\s(,[\-+*/<>=]/.test(line[i - 1]))) {
      let j = i;
      if (line[j] === '0' && (line[j + 1] === 'x' || line[j + 1] === 'X')) {
        j += 2;
        while (j < line.length && /[0-9a-fA-F]/.test(line[j])) j++;
      } else {
        while (j < line.length && /[\d.]/.test(line[j])) j++;
      }
      result += span(syntax.number, line.slice(i, j));
      i = j;
      continue;
    }

    // Uppercase identifier (type / constructor)
    if (/[A-Z]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_']/.test(line[j])) j++;
      const word = line.slice(i, j);
      if (KEYWORDS.has(word)) {
        result += span(syntax.keyword, word);
      } else {
        result += span(syntax.type, word);
      }
      i = j;
      continue;
    }

    // Lowercase identifier (variable / keyword)
    if (/[a-z_]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[a-zA-Z0-9_']/.test(line[j])) j++;
      const word = line.slice(i, j);
      if (KEYWORDS.has(word)) {
        result += span(syntax.keyword, word);
      } else {
        result += span(syntax.variable, word);
      }
      i = j;
      continue;
    }

    // Operators
    if (/[+\-*/<>=!&|^~@#$%?.:\\]/.test(line[i])) {
      let j = i;
      while (j < line.length && /[+\-*/<>=!&|^~@#$%?.:\\]/.test(line[j])) j++;
      result += span(syntax.operator, line.slice(i, j));
      i = j;
      continue;
    }

    // Punctuation
    if (/[()[\]{},;`]/.test(line[i])) {
      result += span(syntax.punctuation, line[i]);
      i++;
      continue;
    }

    // Whitespace and everything else
    result += escapeHtml(line[i]);
    i++;
  }

  return result;
}
