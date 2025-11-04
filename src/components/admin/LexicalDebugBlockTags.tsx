import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

export default function LexicalDebugBlockTags() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        const root = editor.getRootElement();
        if (root) {
          // Loga todos os elementos de bloco filhos do root
          const blocks = Array.from(root.children);
          // eslint-disable-next-line no-console
          console.log('Lexical block tags:', blocks.map(b => b.tagName), blocks);
        }
      });
    });
  }, [editor]);

  return null;
}
