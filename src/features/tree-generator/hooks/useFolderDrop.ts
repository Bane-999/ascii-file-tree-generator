import {useCallback, useRef, useState, type DragEvent} from 'react';
import type {RelativeFileLike} from '../types/tree';
import {
  collectRelativeFilesFromEntry,
  collectRelativeFilesFromHandle,
  filesToRelativeFiles,
  type DataTransferItemWithFileSystem,
} from '../services/browserFileTree';

interface UseFolderDropOptions {
  onFilesReady: (files: RelativeFileLike[]) => void;
}

export function useFolderDrop({onFilesReady}: UseFolderDropOptions) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounterRef = useRef(0);

  const handleDragOver = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDragEnter = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    dragCounterRef.current += 1;

    if (dragCounterRef.current === 1) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    dragCounterRef.current -= 1;

    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    dragCounterRef.current = 0;

    const files = await collectFilesFromDataTransfer(event.dataTransfer);

    if (files.length > 0) {
      onFilesReady(files);
    }
  }, [onFilesReady]);

  return {
    isDragging,
    dropZoneProps: {
      onDragEnter: handleDragEnter,
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
  };
}

async function collectFilesFromDataTransfer(dataTransfer: DataTransfer): Promise<RelativeFileLike[]> {
  const droppedFiles: RelativeFileLike[] = [];

  if (dataTransfer.items.length > 0) {
    const entryPromises = Array.from(dataTransfer.items, collectFilesFromTransferItem).filter(
      (promise): promise is Promise<RelativeFileLike[]> => Boolean(promise),
    );
    const results = await Promise.all(entryPromises);
    results.forEach((result) => droppedFiles.push(...result));
  }

  if (droppedFiles.length > 0) {
    return droppedFiles;
  }

  return dataTransfer.files.length > 0 ? filesToRelativeFiles(dataTransfer.files) : [];
}

function collectFilesFromTransferItem(item: DataTransferItem): Promise<RelativeFileLike[]> | null {
  if (item.kind !== 'file') {
    return null;
  }

  const fileSystemItem = item as unknown as DataTransferItemWithFileSystem;
  const entry = fileSystemItem.webkitGetAsEntry?.();

  if (entry) {
    return collectRelativeFilesFromEntry(entry);
  }

  if (fileSystemItem.getAsFileSystemHandle) {
    return fileSystemItem
      .getAsFileSystemHandle()
      .then((handle) => collectRelativeFilesFromHandle(handle));
  }

  return null;
}
