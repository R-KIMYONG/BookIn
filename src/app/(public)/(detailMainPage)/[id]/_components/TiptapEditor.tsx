'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';
import Placeholder from '@tiptap/extension-placeholder';
import { MAX_LENGTH } from './CommentForm';
import { toast } from 'react-toastify';
import type { Editor } from '@tiptap/react';
import type { EditorView } from 'prosemirror-view';
type TiptapEditorProps = {
  value: string;
  onChange: (html: string, textLength: number) => void;
  onReady?: (editor: Editor) => void;
};
const MAX_LINES = 6;
const TiptapEditor = ({ value, onChange, onReady }: TiptapEditorProps) => {
  const valueRef = useRef(value);
  const getLengthFromEditor = (editor: Editor) => editor.getText().replace(/\n/g, '').length;

  const getLengthFromView = (view: EditorView) => view.state.doc.textContent.replace(/\n/g, '').length;

  useEffect(() => {
    valueRef.current = value;
  }, [value]);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false, // 코드블럭 기능제거
        heading: false, // 헤더 기능 제거
        blockquote: false, // 인용 기능 제거
        horizontalRule: false, // 구분선 제거
        orderedList: {
          //리스트 허용
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },
        bulletList: {
          //리스트 허용
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
      }),
      Placeholder.configure({ placeholder: '댓글을 입력하세요.', emptyEditorClass: 'is-editor-empty' }),
    ],
    editorProps: {
      handleKeyDown(view, event) {
        const length = getLengthFromView(view);

        const lines = view.state.doc.content.childCount;
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

        // cmd+enter / ctrl+enter 제출기능
        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
          event.preventDefault();

          if (length === 0) {
            toast.error('내용을 입력해주세요', { toastId: 'empty' });
            return true;
          }

          const form = view.dom.closest('form');
          form?.requestSubmit();

          return true;
        }
        if (event.metaKey || event.ctrlKey) return false;

        // 줄 제한
        if (event.key === 'Enter' && lines >= MAX_LINES) {
          toast.error(`최대 ${MAX_LINES}줄까지 입력 가능합니다`, {
            toastId: 'line-limit',
          });
          event.preventDefault();
          return true;
        }
        //글자수 제한
        if (length >= MAX_LENGTH && !allowedKeys.includes(event.key)) {
          event.preventDefault();
          return true;
        }

        return false;
      },
      handleTextInput(view, from, to, text) {
        const current = getLengthFromView(view);

        const replacedLength = to - from;
        const nextLength = current - replacedLength + text.length;
        if (nextLength > MAX_LENGTH) {
          if (!toast.isActive('typing-limit')) {
            toast.error('최대 200자까지 입력 가능합니다', { toastId: 'typing-limit' });
          }
          return true;
        }

        return false;
      },
      handlePaste(view, event, slice) {
        const currentLines = view.state.doc.content.childCount;
        const pasteLines = slice.content.content.length;

        const currentLength = view.state.doc.textContent.replace(/\n/g, '').length;
        const pasteText = event.clipboardData?.getData('text') || '';

        if (currentLines + pasteLines - 1 > MAX_LINES || currentLength + pasteText.length > MAX_LENGTH) {
          toast.error('입력 제한을 초과하여 붙여넣을 수 없습니다', { toastId: 'paste' });
          event.preventDefault();
          return true;
        }

        return false;
      },
    },
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => {
      const length = getLengthFromEditor(editor);
      if (length > MAX_LENGTH) {
        toast.error('최대 200자까지 입력 가능합니다', { toastId: 'limit' });
        return;
      }

      const html = editor.getHTML();
      valueRef.current = html;

      onChange(html, length);
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

  useEffect(() => {
    if (editor && onReady) {
      onReady(editor);
    }
  }, [editor, onReady]);

  if (!editor) return null;

  return (
    <EditorContent
      editor={editor}
      className="tiptap-editor min-h-[80px] max-h-[160px] overflow-y-auto text-sm leading-6 outline-none"
    />
  );
};

export default TiptapEditor;
