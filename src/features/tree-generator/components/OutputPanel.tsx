import {Check, Copy} from 'lucide-react';
import {SegmentedControl} from './SegmentedControl';
import type {OutputMode} from '../types/tree';

interface OutputPanelProps {
  output: string;
  copied: boolean;
  outputMode: OutputMode;
  spacingWidth: number;
  onCopy: () => void;
  onOutputModeChange: (mode: OutputMode) => void;
  onSpacingWidthChange: (width: number) => void;
}

export function OutputPanel({
  output,
  copied,
  outputMode,
  spacingWidth,
  onCopy,
  onOutputModeChange,
  onSpacingWidthChange,
}: OutputPanelProps) {
  return (
    <section className="flex h-[400px] flex-col gap-3 lg:h-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-sm font-medium uppercase tracking-wide text-zinc-400">Output</label>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <SegmentedControl value={outputMode} onChange={onOutputModeChange} />

          {outputMode === 'proportional' && (
            <label className="flex items-center gap-2 rounded-lg border border-zinc-800/80 bg-zinc-900/80 px-3 py-1.5">
              <span className="text-xs text-zinc-400">Indent</span>
              <input
                type="number"
                min="2"
                max="12"
                value={spacingWidth}
                onChange={(event) => onSpacingWidthChange(Number(event.target.value))}
                className="w-12 rounded border border-zinc-700 bg-zinc-800 px-1 py-0.5 text-xs text-zinc-300 focus:border-emerald-500 focus:outline-none"
              />
            </label>
          )}

          <button
            type="button"
            onClick={onCopy}
            disabled={!output}
            className="inline-flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-auto rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-4 shadow-inner">
        {output ? (
          <pre
            className={`whitespace-pre text-sm leading-relaxed text-emerald-400/90 ${
              outputMode === 'proportional' ? 'font-sans' : 'font-mono'
            }`}
          >
            {output}
          </pre>
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-sm text-zinc-600">
            Waiting for input...
          </div>
        )}
      </div>
    </section>
  );
}
