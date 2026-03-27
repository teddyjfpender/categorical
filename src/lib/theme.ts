/**
 * Single source of truth for all UI colors and fonts.
 *
 * Both the CodeMirror editor theme and the static syntax highlighter
 * import from here. If you change a color, it updates everywhere.
 *
 * These values mirror the CSS custom properties in global.css — they're
 * duplicated as JS constants because CodeMirror's theme API and the
 * static HTML highlighter both need raw strings at build time (they
 * can't read CSS variables from the DOM).
 *
 * Rule: update global.css AND this file together.
 */

// ── UI surface colors ──────────────────────────────────────────────
export const ui = {
  bgPrimary: '#0a0a0f',
  bgSecondary: '#12121a',
  bgTertiary: '#1a1a26',
  bgCard: '#16161f',
  bgHover: '#1e1e2a',
  border: '#2a2a3a',
  borderBright: '#3a3a4f',
  textPrimary: '#e8e8f0',
  textSecondary: '#9898b0',
  textMuted: '#686880',
  textGutter: '#4a4a5f',
  accent: '#8b5cf6',
  accentBright: '#a78bfa',
  accentDim: '#6d28d9',
  accentRgb: '139, 92, 246',
  success: '#34d399',
  error: '#f87171',
  warning: '#fbbf24',
  info: '#60a5fa',
} as const;

// ── Syntax highlighting colors ─────────────────────────────────────
// Used by both CodeMirror (editor) and highlightHaskell (prose blocks).
export const syntax = {
  keyword: '#c084fc',
  operator: '#67e8f9',
  type: '#fbbf24',
  string: '#34d399',
  number: '#fb923c',
  comment: '#5c5c72',
  punctuation: '#9898b0',
  variable: '#e8e8f0',
  function: '#60a5fa',
} as const;

// ── Fonts ──────────────────────────────────────────────────────────
export const fonts = {
  mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  sans: "'Inter', system-ui, -apple-system, sans-serif",
} as const;
