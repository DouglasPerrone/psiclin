"use client";

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $getSelection, $isRangeSelection, $isRootOrShadowRoot, FORMAT_TEXT_COMMAND } from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { useCallback, useState, useEffect } from 'react';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [activeBlock, setActiveBlock] = useState<string>('');
  const [activeFormats, setActiveFormats] = useState<{[key:string]: boolean}>({});

  useEffect(() => {
    return editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          let blockType = 'paragraph';
          const anchor = selection.anchor;
          let node = anchor.getNode();
          // Sobe até encontrar o bloco pai
          while (node && node.getParent && !$isRootOrShadowRoot(node.getParent())) {
            const parent = node.getParent();
            if (!parent) break;
            node = parent;
          }
          if ($isHeadingNode(node)) blockType = node.getTag();
          setActiveBlock(blockType);
          setActiveFormats({
            bold: selection.hasFormat('bold'),
            italic: selection.hasFormat('italic'),
            underline: selection.hasFormat('underline'),
            strikethrough: selection.hasFormat('strikethrough'),
          });
        }
      });
    });
  }, [editor]);

  const setBlockType = useCallback((blockType: 'paragraph' | 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () =>
          blockType === 'paragraph'
            ? $createParagraphNode()
            : $createHeadingNode(blockType)
        );
      }
    });
  }, [editor]);

  const format = useCallback((command: string, value?: any) => {
    if (command === 'heading') {
      setBlockType(value);
    } else if (command === 'paragraph') {
      setBlockType('paragraph');
    } else {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, value);
    }
  }, [editor, setBlockType]);

  return (
    <div className="flex flex-wrap gap-2 mb-2 bg-muted p-2 rounded items-center">
      <button
        type="button"
        onClick={() => format('bold', 'bold')}
        className={`px-2 py-1 rounded-lg border-2 transition-colors ${activeFormats.bold ? 'border-primary bg-accent' : 'border-transparent'}`}
      >
        <b>B</b>
      </button>
      <button
        type="button"
        onClick={() => format('italic', 'italic')}
        className={`px-2 py-1 rounded-lg border-2 transition-colors ${activeFormats.italic ? 'border-primary bg-accent' : 'border-transparent'}`}
      >
        <i>I</i>
      </button>
      <button
        type="button"
        onClick={() => format('underline', 'underline')}
        className={`px-2 py-1 rounded-lg border-2 transition-colors ${activeFormats.underline ? 'border-primary bg-accent' : 'border-transparent'}`}
      >
        <u>U</u>
      </button>
      <button
        type="button"
        onClick={() => format('strikethrough', 'strikethrough')}
        className={`px-2 py-1 rounded-lg border-2 transition-colors ${activeFormats.strikethrough ? 'border-primary bg-accent' : 'border-transparent'}`}
      >
        <s>S</s>
      </button>
      <button
        type="button"
        onClick={() => format('heading', 'h1')}
        className={`px-2 py-1 rounded-lg border-2 transition-colors ${activeBlock === 'h1' ? 'border-primary bg-accent' : 'border-transparent'}`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => format('heading', 'h2')}
        className={`px-2 py-1 rounded-lg border-2 transition-colors ${activeBlock === 'h2' ? 'border-primary bg-accent' : 'border-transparent'}`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => format('heading', 'h3')}
        className={`px-2 py-1 rounded-lg border-2 transition-colors ${activeBlock === 'h3' ? 'border-primary bg-accent' : 'border-transparent'}`}
      >
        H3
      </button>
      <button
        type="button"
        onClick={() => format('paragraph')}
        className={`px-2 py-1 rounded-lg border-2 transition-colors ${activeBlock === 'paragraph' ? 'border-primary bg-accent' : 'border-transparent'}`}
      >
        P
      </button>
      {/* Adicione mais botões conforme necessário */}
    </div>
  );
}
