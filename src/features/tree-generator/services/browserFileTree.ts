import type {RelativeFileLike} from '../types/tree';
import {shouldIgnorePathPart} from '../utils/fileTreeBuilder';

export const MAX_DROPPED_FILES = 5000;

interface FileSystemEntryLike {
  name: string;
  isFile: boolean;
  isDirectory: boolean;
  createReader: () => FileSystemDirectoryReaderLike;
  file: (success: (file: File) => void, error?: (error: DOMException) => void) => void;
}

interface FileSystemDirectoryReaderLike {
  readEntries: (
    success: (entries: FileSystemEntryLike[]) => void,
    error?: (error: DOMException) => void,
  ) => void;
}

interface DirectoryHandleLike extends FileSystemDirectoryHandle {
  values: () => AsyncIterable<FileSystemHandle>;
}

export interface DataTransferItemWithFileSystem {
  kind: string;
  webkitGetAsEntry?: () => FileSystemEntryLike | null;
  getAsFileSystemHandle?: () => Promise<FileSystemHandle | null>;
}

export async function collectRelativeFilesFromEntry(
  entry: FileSystemEntryLike | null,
  parentPath = '',
  budget: {count: number} = {count: 0},
): Promise<RelativeFileLike[]> {
  if (!entry || budget.count >= MAX_DROPPED_FILES || shouldIgnorePathPart(entry.name, parentPath ? 1 : 0)) {
    return [];
  }

  const currentPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;

  if (entry.isFile) {
    const file = await entryToFile(entry);
    budget.count += 1;
    return [{name: file.name, webkitRelativePath: currentPath, isDirectory: false}];
  }

  if (!entry.isDirectory) {
    return [];
  }

  budget.count += 1;

  const entries = await readDirectoryEntries(entry.createReader());
  const collected: RelativeFileLike[] = [
    {name: entry.name, webkitRelativePath: currentPath, isDirectory: true},
  ];

  for (const childEntry of entries) {
    if (budget.count >= MAX_DROPPED_FILES) break;
    collected.push(...await collectRelativeFilesFromEntry(childEntry, currentPath, budget));
  }

  return collected;
}

export async function collectRelativeFilesFromHandle(
  handle: FileSystemHandle | null,
  parentPath = '',
  budget: {count: number} = {count: 0},
): Promise<RelativeFileLike[]> {
  if (!handle || budget.count >= MAX_DROPPED_FILES || shouldIgnorePathPart(handle.name, parentPath ? 1 : 0)) {
    return [];
  }

  const currentPath = parentPath ? `${parentPath}/${handle.name}` : handle.name;

  if (handle.kind === 'file') {
    const file = await (handle as FileSystemFileHandle).getFile();
    budget.count += 1;
    return [{name: file.name, webkitRelativePath: currentPath, isDirectory: false}];
  }

  if (handle.kind !== 'directory') {
    return [];
  }

  budget.count += 1;

  const collected: RelativeFileLike[] = [
    {name: handle.name, webkitRelativePath: currentPath, isDirectory: true},
  ];

  for await (const childHandle of (handle as DirectoryHandleLike).values()) {
    if (budget.count >= MAX_DROPPED_FILES) break;
    collected.push(...await collectRelativeFilesFromHandle(childHandle, currentPath, budget));
  }

  return collected;
}

export function filesToRelativeFiles(files: FileList): RelativeFileLike[] {
  return Array.from(files, (file) => ({
    name: file.name,
    webkitRelativePath: getRelativePath(file),
    isDirectory: false,
  }));
}

async function readDirectoryEntries(reader: FileSystemDirectoryReaderLike): Promise<FileSystemEntryLike[]> {
  const entries: FileSystemEntryLike[] = [];
  let readEntries = await new Promise<FileSystemEntryLike[]>((resolve, reject) => {
    reader.readEntries(resolve, reject);
  });

  while (readEntries.length > 0) {
    entries.push(...readEntries);
    readEntries = await new Promise<FileSystemEntryLike[]>((resolve, reject) => {
      reader.readEntries(resolve, reject);
    });
  }

  return entries;
}

function entryToFile(entry: FileSystemEntryLike): Promise<File> {
  return new Promise((resolve, reject) => {
    entry.file(resolve, reject);
  });
}

function getRelativePath(file: File): string {
  return 'webkitRelativePath' in file && typeof file.webkitRelativePath === 'string'
    ? file.webkitRelativePath || file.name
    : file.name;
}
