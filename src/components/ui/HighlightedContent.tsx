import { useRef, useEffect } from 'react';
import { highlightHaskell } from '../../lib/highlightHaskell';

interface HighlightedContentProps {
  html: string;
  className?: string;
}

/**
 * Renders HTML content and syntax-highlights all <pre><code> blocks
 * using the same Haskell color palette as the CodeMirror editor.
 */
export function HighlightedContent({ html, className = '' }: HighlightedContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const codeBlocks = ref.current.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      // Only highlight if not already highlighted
      if (block.getAttribute('data-highlighted')) return;

      const raw = block.textContent || '';
      block.innerHTML = highlightHaskell(raw);
      block.setAttribute('data-highlighted', 'true');
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
