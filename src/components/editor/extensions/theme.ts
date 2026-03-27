import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

// Editor theme — dark theme matching the Categorical aesthetic
export const categoricalTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#0f0f17',
      color: '#e8e8f0',
      fontSize: '14px',
      lineHeight: '1.7',
    },
    '.cm-content': {
      caretColor: '#a78bfa',
      padding: '16px 0',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: '#a78bfa',
      borderLeftWidth: '2px',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: 'rgba(139, 92, 246, 0.25)',
    },
    '.cm-panels': {
      backgroundColor: '#12121a',
      color: '#e8e8f0',
    },
    '.cm-panels.cm-panels-top': {
      borderBottom: '1px solid #2a2a3a',
    },
    '.cm-panels.cm-panels-bottom': {
      borderTop: '1px solid #2a2a3a',
    },
    '.cm-searchMatch': {
      backgroundColor: 'rgba(139, 92, 246, 0.3)',
      outline: '1px solid rgba(139, 92, 246, 0.5)',
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: 'rgba(139, 92, 246, 0.5)',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    '.cm-selectionMatch': {
      backgroundColor: 'rgba(139, 92, 246, 0.15)',
    },
    '.cm-matchingBracket, .cm-nonmatchingBracket': {
      backgroundColor: 'rgba(139, 92, 246, 0.25)',
      outline: '1px solid rgba(139, 92, 246, 0.5)',
    },
    '.cm-gutters': {
      backgroundColor: '#0f0f17',
      color: '#4a4a5f',
      border: 'none',
      paddingRight: '8px',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      color: '#8b5cf6',
    },
    '.cm-foldPlaceholder': {
      backgroundColor: '#1a1a26',
      border: '1px solid #2a2a3a',
      color: '#9898b0',
    },
    '.cm-tooltip': {
      border: '1px solid #2a2a3a',
      backgroundColor: '#16161f',
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: '#2a2a3a',
      borderBottomColor: '#2a2a3a',
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: '#16161f',
      borderBottomColor: '#16161f',
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        color: '#e8e8f0',
      },
    },
    // Error/warning line decorations
    '.cm-lintRange-error': {
      backgroundImage: 'none',
      borderBottom: '2px wavy #f87171',
    },
    '.cm-lintRange-warning': {
      backgroundImage: 'none',
      borderBottom: '2px wavy #fbbf24',
    },
  },
  { dark: true },
);

// Syntax highlighting colors
export const categoricalHighlighting = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: '#c084fc' },
    { tag: tags.operator, color: '#67e8f9' },
    { tag: tags.variableName, color: '#e8e8f0' },
    { tag: tags.typeName, color: '#fbbf24' },
    { tag: tags.string, color: '#34d399' },
    { tag: tags.number, color: '#fb923c' },
    { tag: tags.comment, color: '#5c5c72', fontStyle: 'italic' },
    { tag: tags.lineComment, color: '#5c5c72', fontStyle: 'italic' },
    { tag: tags.punctuation, color: '#9898b0' },
    { tag: tags.bracket, color: '#9898b0' },
    { tag: tags.definition(tags.variableName), color: '#60a5fa' },
    { tag: tags.definition(tags.typeName), color: '#fbbf24' },
    { tag: tags.function(tags.variableName), color: '#60a5fa' },
    { tag: tags.bool, color: '#fb923c' },
    { tag: tags.null, color: '#fb923c' },
    { tag: tags.className, color: '#fbbf24' },
    { tag: tags.moduleKeyword, color: '#c084fc' },
  ]),
);
