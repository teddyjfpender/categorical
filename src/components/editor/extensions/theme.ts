import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { ui, syntax, fonts } from '../../../lib/theme';

export const categoricalTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: ui.bgPrimary,
      color: ui.textPrimary,
      fontSize: '14px',
      lineHeight: '1.7',
    },
    '.cm-content': {
      caretColor: ui.accentBright,
      padding: '16px 0',
      fontFamily: fonts.mono,
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: ui.accentBright,
      borderLeftWidth: '2px',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: `rgba(${ui.accentRgb}, 0.25)`,
    },
    '.cm-panels': {
      backgroundColor: ui.bgSecondary,
      color: ui.textPrimary,
    },
    '.cm-panels.cm-panels-top': {
      borderBottom: `1px solid ${ui.border}`,
    },
    '.cm-panels.cm-panels-bottom': {
      borderTop: `1px solid ${ui.border}`,
    },
    '.cm-searchMatch': {
      backgroundColor: `rgba(${ui.accentRgb}, 0.3)`,
      outline: `1px solid rgba(${ui.accentRgb}, 0.5)`,
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: `rgba(${ui.accentRgb}, 0.5)`,
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    '.cm-selectionMatch': {
      backgroundColor: `rgba(${ui.accentRgb}, 0.15)`,
    },
    '.cm-matchingBracket, .cm-nonmatchingBracket': {
      backgroundColor: `rgba(${ui.accentRgb}, 0.25)`,
      outline: `1px solid rgba(${ui.accentRgb}, 0.5)`,
    },
    '.cm-gutters': {
      backgroundColor: ui.bgPrimary,
      color: ui.textGutter,
      border: 'none',
      paddingRight: '8px',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      color: ui.accent,
    },
    '.cm-foldPlaceholder': {
      backgroundColor: ui.bgTertiary,
      border: `1px solid ${ui.border}`,
      color: ui.textSecondary,
    },
    '.cm-tooltip': {
      border: `1px solid ${ui.border}`,
      backgroundColor: ui.bgCard,
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: ui.border,
      borderBottomColor: ui.border,
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: ui.bgCard,
      borderBottomColor: ui.bgCard,
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: `rgba(${ui.accentRgb}, 0.2)`,
        color: ui.textPrimary,
      },
    },
    '.cm-lintRange-error': {
      backgroundImage: 'none',
      borderBottom: `2px wavy ${ui.error}`,
    },
    '.cm-lintRange-warning': {
      backgroundImage: 'none',
      borderBottom: `2px wavy ${ui.warning}`,
    },
  },
  { dark: true },
);

export const categoricalHighlighting = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: syntax.keyword },
    { tag: tags.operator, color: syntax.operator },
    { tag: tags.variableName, color: syntax.variable },
    { tag: tags.typeName, color: syntax.type },
    { tag: tags.string, color: syntax.string },
    { tag: tags.number, color: syntax.number },
    { tag: tags.comment, color: syntax.comment, fontStyle: 'italic' },
    { tag: tags.lineComment, color: syntax.comment, fontStyle: 'italic' },
    { tag: tags.punctuation, color: syntax.punctuation },
    { tag: tags.bracket, color: syntax.punctuation },
    { tag: tags.definition(tags.variableName), color: syntax.function },
    { tag: tags.definition(tags.typeName), color: syntax.type },
    { tag: tags.function(tags.variableName), color: syntax.function },
    { tag: tags.bool, color: syntax.number },
    { tag: tags.null, color: syntax.number },
    { tag: tags.className, color: syntax.type },
    { tag: tags.moduleKeyword, color: syntax.keyword },
  ]),
);
