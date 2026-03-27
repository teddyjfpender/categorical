import { useMemo } from 'react';
import { highlightHaskell } from '../../lib/highlightHaskell';

interface HighlightedContentProps {
  html: string;
  className?: string;
}

/**
 * Renders HTML content with syntax-highlighted <pre><code> blocks.
 * Pre-processes the HTML string to replace code block contents with
 * highlighted Haskell, avoiding DOM mutation timing issues.
 */
export function HighlightedContent({ html, className = '' }: HighlightedContentProps) {
  const highlighted = useMemo(() => {
    // Find all <pre><code>...</code></pre> blocks and highlight their contents
    return html.replace(
      /<pre><code(?:\s[^>]*)?>([^]*?)<\/code><\/pre>/g,
      (_match, codeContent: string) => {
        // Decode HTML entities back to plain text before highlighting
        const decoded = codeContent
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .replace(/&#39;/g, "'")
          .replace(/&quot;/g, '"');
        return `<pre><code>${highlightHaskell(decoded)}</code></pre>`;
      },
    );
  }, [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
