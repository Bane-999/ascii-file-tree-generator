import {useCallback, useMemo, useState} from 'react';
import type {OutputMode, RelativeFileLike} from '../types/tree';
import {buildTreeFromFiles} from '../utils/fileTreeBuilder';
import {generateAsciiTree, parseIndentedText, treeNodesToIndentedText} from '../utils/treeFormatter';

export const DEFAULT_TREE_INPUT = `src
  components
    Header.tsx
    Footer.tsx
  pages
    Home.tsx
    About.tsx
package.json
README.md`;

export function useTreeGenerator() {
  const [input, setInput] = useState(DEFAULT_TREE_INPUT);
  const [outputMode, setOutputMode] = useState<OutputMode>('monospace');
  const [spacingWidth, setSpacingWidth] = useState(7);

  const output = useMemo(() => {
    const tree = parseIndentedText(input);

    if (!tree) {
      return '';
    }

    return generateAsciiTree(tree, {mode: outputMode, spacingWidth}).trim();
  }, [input, outputMode, spacingWidth]);

  const applyRelativeFiles = useCallback((files: ArrayLike<RelativeFileLike>) => {
    if (files.length === 0) return;

    const nodes = buildTreeFromFiles(files);

    if (nodes.length > 0) {
      setInput(treeNodesToIndentedText(nodes).trimEnd());
    }
  }, []);

  return {
    input,
    setInput,
    output,
    outputMode,
    setOutputMode,
    spacingWidth,
    setSpacingWidth,
    applyRelativeFiles,
  };
}
