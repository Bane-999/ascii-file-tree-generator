import {InputPanel} from './InputPanel';
import {OutputPanel} from './OutputPanel';
import {useCopyToClipboard} from '../hooks/useCopyToClipboard';
import {useFolderDrop} from '../hooks/useFolderDrop';
import {useTreeGenerator} from '../hooks/useTreeGenerator';

export function TreeGeneratorWorkspace() {
  const {
    input,
    setInput,
    output,
    outputMode,
    setOutputMode,
    spacingWidth,
    setSpacingWidth,
    applyRelativeFiles,
  } = useTreeGenerator();
  const {copied, copy} = useCopyToClipboard();
  const {isDragging, dropZoneProps} = useFolderDrop({onFilesReady: applyRelativeFiles});

  return (
    <main className="flex flex-col gap-6 lg:grid lg:h-[calc(100vh-12rem)] lg:grid-cols-2">
      <InputPanel
        input={input}
        isDragging={isDragging}
        dropZoneProps={dropZoneProps}
        onInputChange={setInput}
        onFilesReady={applyRelativeFiles}
      />
      <OutputPanel
        output={output}
        copied={copied}
        outputMode={outputMode}
        spacingWidth={spacingWidth}
        onCopy={() => void copy(output)}
        onOutputModeChange={setOutputMode}
        onSpacingWidthChange={setSpacingWidth}
      />
    </main>
  );
}
