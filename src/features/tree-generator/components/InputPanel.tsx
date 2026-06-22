import {UploadCloud} from 'lucide-react';
import {useRef, useState, type ChangeEvent, type HTMLAttributes, type KeyboardEvent} from 'react';
import {filesToRelativeFiles} from '../services/browserFileTree';
import type {RelativeFileLike} from '../types/tree';

interface InputPanelProps {
  input: string;
  isDragging: boolean;
  dropZoneProps: HTMLAttributes<HTMLDivElement>;
  onInputChange: (value: string) => void;
  onFilesReady: (files: RelativeFileLike[]) => void;
}

export function InputPanel({
  input,
  isDragging,
  dropZoneProps,
  onInputChange,
  onFilesReady,
}: InputPanelProps) {
  const [fileInputKey, setFileInputKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      onFilesReady(filesToRelativeFiles(event.target.files));
    }

    setFileInputKey((currentKey) => currentKey + 1);
  };

  const handleInputTab = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Tab') return;

    event.preventDefault();

    const textarea = event.currentTarget;
    const {selectionStart, selectionEnd, value} = textarea;
    const indent = '  ';
    const nextValue = `${value.slice(0, selectionStart)}${indent}${value.slice(selectionEnd)}`;
    const nextCursorPosition = selectionStart + indent.length;

    onInputChange(nextValue);

    requestAnimationFrame(() => {
      textarea.setSelectionRange(nextCursorPosition, nextCursorPosition);
    });
  };

  return (
    <section className="flex h-[400px] flex-col gap-3 lg:h-full">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="tree-input" className="text-sm font-medium uppercase tracking-wide text-zinc-400">
          Input
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-md bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
        >
          <UploadCloud className="h-3.5 w-3.5" />
          <span>Upload Folder</span>
        </button>
        <input
          key={fileInputKey}
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          // React does not type Chromium's directory picker attributes yet.
          {...{webkitdirectory: '', directory: ''}}
        />
      </div>

      <div className="relative min-h-0 flex-1" {...dropZoneProps}>
        <textarea
          id="tree-input"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={handleInputTab}
          className={`h-full w-full resize-none rounded-xl border bg-zinc-900/50 p-4 font-mono text-sm leading-relaxed text-zinc-300 shadow-inner transition-colors focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
            isDragging ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800/80'
          }`}
          placeholder="Paste your folder structure here or drag and drop a folder..."
          spellCheck={false}
        />

        {isDragging && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl border-2 border-dashed border-emerald-500 bg-zinc-950/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 text-emerald-400">
              <UploadCloud className="h-8 w-8 animate-bounce" />
              <span className="font-medium">Drop folder to generate tree</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
