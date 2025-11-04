"use client";

import * as React from "react";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ToolbarPlugin } from './LexicalToolbar';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { $getRoot, $insertNodes } from "lexical";


// Plugin to set the initial value from HTML
function SetInitialValuePlugin({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  const [isInitialized, setIsInitialized] = React.useState(false);

  React.useEffect(() => {
    if (!isInitialized && value && editor) {
      setIsInitialized(true);
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(value, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear(); // Clear the initial empty paragraph
        root.select();
        $insertNodes(nodes);
      });
    }
  }, [editor, value, isInitialized]);

  return null;
}


function HtmlOnChangePlugin({ onChange }: { onChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();
  return (
    <OnChangePlugin
      onChange={editorState => {
        editorState.read(() => {
          const html = $generateHtmlFromNodes(editor);
          onChange(html);
        });
      }}
    />
  );
}

export default function LexicalEditor({ value, onChange }: { value: string, onChange: (html: string) => void }) {
  const initialConfig = {
    namespace: 'BlogEditor',
    theme: {
      paragraph: 'mb-2',
      heading: {
        h1: 'text-3xl font-bold mb-2',
        h2: 'text-2xl font-bold mb-2',
        h3: 'text-xl font-bold mb-2',
      },
      text: {
        bold: 'font-bold',
        italic: 'italic',
        underline: 'underline',
        strikethrough: 'line-through',
      },
    },
    onError: (error: Error) => { throw error; },
    nodes: [HeadingNode, QuoteNode],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border rounded bg-white p-2 min-h-[200px]">
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable className="outline-none min-h-[120px] p-2 editor-content" />}
          placeholder={<div className="text-muted-foreground">Digite o conteúdo do post...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <HtmlOnChangePlugin onChange={onChange} />
        <SetInitialValuePlugin value={value} />
      </div>
    </LexicalComposer>
  );
}
