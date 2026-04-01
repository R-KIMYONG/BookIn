'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';

type Props = {
  value: string;
  onChange: (html: string, textLength: number) => void;
};

const TiptapEditor = ({ value, onChange }: Props) => {
  const valueRef = useRef(value);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: false,
        blockquote: {},
        horizontalRule: false,
      }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();

      if (html === valueRef.current) return;

      const text = editor.getText();
      onChange(html, text.length);
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '', {
        emitUpdate: false,
        parseOptions: {
          preserveWhitespace: 'full',
        },
      });
    }
  }, [value, editor]);

  if (!editor) return null;

  if (!editor) {
    return <div className="border rounded-md p-2 bg-white h-[150px]" />;
  }

  return (
    <div className="border rounded-md p-2 bg-white">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
