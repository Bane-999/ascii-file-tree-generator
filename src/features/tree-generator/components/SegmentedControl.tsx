import type {OutputMode} from '../types/tree';

interface SegmentedControlProps {
  value: OutputMode;
  onChange: (mode: OutputMode) => void;
}

const options: Array<{label: string; value: OutputMode}> = [
  {label: 'Monospace', value: 'monospace'},
  {label: 'Proportional', value: 'proportional'},
];

export function SegmentedControl({value, onChange}: SegmentedControlProps) {
  return (
    <div className="flex items-center rounded-lg border border-zinc-800/80 bg-zinc-900/80 p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            value === option.value
              ? 'bg-zinc-800 text-emerald-400 shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
