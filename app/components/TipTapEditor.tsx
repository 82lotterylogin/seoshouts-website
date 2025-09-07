'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
// Reduced extension set for maximum stability
// import TextStyle from '@tiptap/extension-text-style';
// import Color from '@tiptap/extension-color';
// import Underline from '@tiptap/extension-underline';
// import TextAlign from '@tiptap/extension-text-align';
// import Highlight from '@tiptap/extension-highlight';
import { useState, useEffect } from 'react';
import MediaLibraryModal from './MediaLibraryModal';

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({ value, onChange, placeholder }: TipTapEditorProps) {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  // const [showColorPicker, setShowColorPicker] = useState(false);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      try {
        if (editor && typeof editor.getHTML === 'function') {
          const html = editor.getHTML();
          onChange(html);
        }
      } catch (error) {
        console.error('TipTap editor update error:', error);
      }
    },
    onCreate: ({ editor }) => {
      setIsEditorReady(true);
    },
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[384px] p-4 text-sm leading-relaxed',
      },
    },
    immediatelyRender: false,
  });

  const handleImageInsert = (imageUrl: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
    setShowMediaLibrary(false);
  };

  const setLink = () => {
    if (typeof window === 'undefined') return;
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };


  const colors = [
    '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
    '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
    '#E6B8AF', '#F4CCCC', '#FCE5CD', '#FFF2CC', '#D9EAD3', '#D0E0E3', '#C9DAF8', '#CFE2F3', '#D9D2E9', '#EAD1DC'
  ];


  if (!isMounted || !editor) {
    return (
      <div className="border border-gray-300 rounded-md p-4 min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-500">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-300 p-3 bg-gray-50">
        <div className="flex flex-wrap gap-2 items-center">

          {/* Text formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded text-sm font-bold ${
              editor.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            B
          </button>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded text-sm italic ${
              editor.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            I
          </button>

          {/* Underline disabled for stability */}

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-2 py-1 rounded text-sm line-through ${
              editor.isActive('strike') ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            S
          </button>


          <div className="w-px h-6 bg-gray-300"></div>

          {/* Color Picker (disabled for stability) */}

          {/* Highlight disabled for stability */}

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-2 py-1 rounded text-sm font-bold ${
              editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            H1
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-2 py-1 rounded text-sm font-bold ${
              editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            H2
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-2 py-1 rounded text-sm font-bold ${
              editor.isActive('heading', { level: 3 }) ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            H3
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Text Alignment disabled for stability */}

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-2 py-1 rounded text-sm ${
              editor.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            • List
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-2 py-1 rounded text-sm ${
              editor.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            1. List
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Quote and Code */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`px-2 py-1 rounded text-sm ${
              editor.isActive('blockquote') ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            " Quote
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`px-2 py-1 rounded text-sm font-mono ${
              editor.isActive('code') ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            &lt;/&gt;
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`px-2 py-1 rounded text-sm ${
              editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Code Block
          </button>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Link, Image, Table */}
          <button
            type="button"
            onClick={setLink}
            className={`px-2 py-1 rounded text-sm ${
              editor.isActive('link') ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔗 Link
          </button>

          <button
            type="button"
            onClick={() => setShowMediaLibrary(true)}
            className="px-2 py-1 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
          >
            📷 Image
          </button>


          <div className="w-px h-6 bg-gray-300"></div>

          {/* Undo/Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="px-2 py-1 rounded text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 border border-gray-300"
          >
            ↶
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="px-2 py-1 rounded text-sm bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 border border-gray-300"
          >
            ↷
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-white">
        <div className="h-[400px] overflow-y-auto border-0">
          <EditorContent editor={editor} />
        </div>
      </div>
      
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          padding: 16px;
          font-size: 14px;
          line-height: 1.6;
          min-height: 384px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        
        .ProseMirror p {
          margin: 8px 0;
          font-size: 14px;
        }
        
        .ProseMirror h1 {
          font-size: 24px;
          font-weight: bold;
          margin: 16px 0 8px 0;
        }
        
        .ProseMirror h2 {
          font-size: 20px;
          font-weight: bold;
          margin: 14px 0 6px 0;
        }
        
        .ProseMirror h3 {
          font-size: 18px;
          font-weight: bold;
          margin: 12px 0 4px 0;
        }
        
        .ProseMirror ul, .ProseMirror ol {
          padding-left: 24px;
          margin: 8px 0;
        }
        
        .ProseMirror li {
          margin: 4px 0;
          font-size: 14px;
        }
        
        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          margin: 12px 0;
          padding-left: 16px;
          font-style: italic;
          color: #6b7280;
        }
        
        .ProseMirror pre {
          background: #f3f4f6;
          border-radius: 8px;
          padding: 12px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
          overflow-x: auto;
          margin: 12px 0;
        }
        
        .ProseMirror code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 13px;
        }
        
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 8px 0;
        }
        
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .ProseMirror a:hover {
          color: #1d4ed8;
        }
        
        
        .ProseMirror mark {
          background: #fef08a;
          padding: 1px 2px;
          border-radius: 2px;
        }
      `}</style>

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelectImage={handleImageInsert}
      />
    </div>
  );
}