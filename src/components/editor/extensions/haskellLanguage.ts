import { LanguageSupport, StreamLanguage } from '@codemirror/language';

// Haskell syntax highlighting via StreamLanguage (simpler than a full Lezer grammar).
// This covers the most important Haskell constructs for a learning platform.

const haskellStreamParser = {
  name: 'haskell',

  startState() {
    return { inString: false, inComment: false, inBlockComment: 0 };
  },

  token(stream: any, state: any): string | null {
    // Block comments {- ... -}
    if (state.inBlockComment > 0) {
      if (stream.match('{-')) {
        state.inBlockComment++;
        return 'comment';
      }
      if (stream.match('-}')) {
        state.inBlockComment--;
        return 'comment';
      }
      stream.next();
      return 'comment';
    }

    // Line comments
    if (stream.match('--')) {
      stream.skipToEnd();
      return 'lineComment';
    }

    // Block comment start
    if (stream.match('{-')) {
      state.inBlockComment = 1;
      return 'comment';
    }

    // Strings
    if (stream.match('"')) {
      while (!stream.eol()) {
        const ch = stream.next();
        if (ch === '\\') {
          stream.next();
        } else if (ch === '"') {
          break;
        }
      }
      return 'string';
    }

    // Characters
    if (stream.match("'")) {
      if (stream.eat('\\')) {
        stream.next();
      } else {
        stream.next();
      }
      stream.eat("'");
      return 'string';
    }

    // Numbers
    if (stream.match(/^0[xX][0-9a-fA-F]+/) || stream.match(/^0[oO][0-7]+/) || stream.match(/^\d+(\.\d+)?([eE][+-]?\d+)?/)) {
      return 'number';
    }

    // Keywords
    if (
      stream.match(
        /^(module|where|import|qualified|as|hiding|data|type|newtype|class|instance|deriving|do|let|in|case|of|if|then|else|forall|infixl|infixr|infix|default|foreign)\b/,
      )
    ) {
      return 'keyword';
    }

    // Built-in types and constructors (start with uppercase)
    if (stream.match(/^[A-Z][a-zA-Z0-9_']*/)) {
      return 'typeName';
    }

    // Operators
    if (stream.match(/^[+\-*/<>=!&|^~@#$%?.:\\]+/)) {
      return 'operator';
    }

    // Identifiers
    if (stream.match(/^[a-z_][a-zA-Z0-9_']*/)) {
      return 'variableName';
    }

    // Brackets and punctuation
    if (stream.match(/^[()[\]{},;]/)) {
      return 'punctuation';
    }

    // Skip whitespace
    if (stream.eatSpace()) {
      return null;
    }

    stream.next();
    return null;
  },
};

const haskellLang = StreamLanguage.define(haskellStreamParser);

export function haskell(): LanguageSupport {
  return new LanguageSupport(haskellLang);
}
