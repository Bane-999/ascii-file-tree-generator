import type {OutputMode, TreeNode} from '../types/tree';

const PROPORTIONAL_SPACE = '\u00A0';

export function parseIndentedText(text: string): TreeNode | null {
  const lines = text.split('\n').filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return null;
  }

  const root: TreeNode = {name: '.', children: [], isDirectory: true};
  const stack = [{node: root, indent: -1}];

  for (const line of lines) {
    const normalizedLine = line.replace(/\t/g, '  ');
    const indent = normalizedLine.search(/\S|$/);
    const name = normalizedLine.trim();
    const newNode: TreeNode = {name, children: []};

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }

    stack[stack.length - 1].node.children.push(newNode);
    stack.push({node: newNode, indent});
  }

  return root;
}

export function generateAsciiTree(
  node: TreeNode,
  options: {
    mode: OutputMode;
    spacingWidth: number;
    prefix?: string;
    isLast?: boolean;
    isRoot?: boolean;
  },
): string {
  const {mode, spacingWidth, prefix = '', isLast = true, isRoot = true} = options;
  const isProportional = mode === 'proportional';
  const spaceChar = isProportional ? PROPORTIONAL_SPACE : ' ';
  const teeBranch = isProportional ? `├──${spaceChar}` : '├── ';
  const elbowBranch = isProportional ? `└──${spaceChar}` : '└── ';
  const pipeSpacing = spaceChar.repeat(Math.max(1, spacingWidth - 1));
  const emptySpacing = spaceChar.repeat(spacingWidth);
  const pipeBranch = isProportional ? `│${pipeSpacing}` : '│   ';
  const emptyBranch = isProportional ? emptySpacing : '    ';

  if (isRoot) {
    return [
      `${node.name}\n`,
      ...node.children.map((child, index) =>
        generateAsciiTree(child, {
          mode,
          spacingWidth,
          isLast: index === node.children.length - 1,
          isRoot: false,
        }),
      ),
    ].join('');
  }

  const childPrefix = prefix + (isLast ? emptyBranch : pipeBranch);
  return [
    `${prefix}${isLast ? elbowBranch : teeBranch}${node.name}\n`,
    ...node.children.map((child, index) =>
      generateAsciiTree(child, {
        mode,
        spacingWidth,
        prefix: childPrefix,
        isLast: index === node.children.length - 1,
        isRoot: false,
      }),
    ),
  ].join('');
}

export function treeNodesToIndentedText(nodes: TreeNode[], indentLevel = 0): string {
  return nodes
    .map((node) => {
      const line = `${'  '.repeat(indentLevel)}${node.name}\n`;
      return node.children.length > 0
        ? `${line}${treeNodesToIndentedText(node.children, indentLevel + 1)}`
        : line;
    })
    .join('');
}
