import type {RelativeFileLike, TreeNode} from '../types/tree';

export const IGNORED_PATH_PARTS = [
  '.git',
  'node_modules',
  '.DS_Store',
  '.next',
  'dist',
  'build',
  'coverage',
];

export function shouldIgnorePathPart(part: string, index: number): boolean {
  return index > 0 && IGNORED_PATH_PARTS.includes(part);
}

export function buildTreeFromFiles(files: ArrayLike<RelativeFileLike>): TreeNode[] {
  const root: TreeNode = {name: 'root', children: [], isDirectory: true};

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const relativePath = file.webkitRelativePath || file.name;
    const pathParts = relativePath.split('/');

    if (pathParts.length === 0 || pathParts[0] === '' || pathParts.some(shouldIgnorePathPart)) {
      continue;
    }

    let currentNode = root;

    for (let partIndex = 0; partIndex < pathParts.length; partIndex += 1) {
      const part = pathParts[partIndex];
      const isLastPart = partIndex === pathParts.length - 1;
      const isDirectory = !isLastPart || Boolean(file.isDirectory);
      let childNode = currentNode.children.find((child) => child.name === part);

      if (!childNode) {
        childNode = {name: part, children: [], isDirectory};
        currentNode.children.push(childNode);
      } else if (isDirectory) {
        childNode.isDirectory = true;
      }

      currentNode = childNode;
    }
  }

  sortTree(root);
  return root.children;
}

function sortTree(node: TreeNode): void {
  node.children.sort((left, right) => {
    if (left.isDirectory && !right.isDirectory) return -1;
    if (!left.isDirectory && right.isDirectory) return 1;
    return left.name.localeCompare(right.name);
  });

  node.children.forEach(sortTree);
}
