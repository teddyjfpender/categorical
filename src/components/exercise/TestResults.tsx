interface TestResultsProps {
  success: boolean;
}

export function TestResults({ success }: TestResultsProps) {
  if (!success) return null;

  return (
    <div className="mx-4 mb-4 px-4 py-3 rounded-lg bg-success/10 border border-success/20">
      <div className="flex items-center gap-2">
        <span className="text-success text-lg">{'\u2713'}</span>
        <p className="text-sm text-success font-medium">
          Exercise completed! Great work.
        </p>
      </div>
    </div>
  );
}
