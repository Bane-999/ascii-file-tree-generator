export interface TreeNode {
  name: string;
  children: TreeNode[];
  isDirectory?: boolean;
}

export interface RelativeFileLike {
  name: string;
  webkitRelativePath: string;
  isDirectory?: boolean;
}

export type OutputMode = 'monospace' | 'proportional';
