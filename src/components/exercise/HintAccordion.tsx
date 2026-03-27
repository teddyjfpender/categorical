interface HintAccordionProps {
  hints: string[];
}

export function HintAccordion({ hints }: HintAccordionProps) {
  return (
    <div className="rounded-lg border border-border bg-bg-secondary overflow-hidden">
      <div className="px-4 py-2 border-b border-border">
        <h4 className="text-xs font-medium text-text-secondary uppercase tracking-wider">
          Hints ({hints.length})
        </h4>
      </div>
      <div className="divide-y divide-border">
        {hints.map((hint, i) => (
          <div key={i} className="px-4 py-3">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-text-secondary leading-relaxed">{hint}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
