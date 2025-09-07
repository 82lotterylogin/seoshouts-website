'use client';

import { useEffect, useRef, useState } from 'react';

interface CustomWysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CustomWysiwygEditor({ value, onChange, placeholder }: CustomWysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [htmlValue, setHtmlValue] = useState(value || '');

  useEffect(() => {
    setHtmlValue(value || '');
    if (editorRef.current && !isHtmlMode) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (command: string, value?: string) => {
    // Ensure focus before executing command
    editorRef.current?.focus();
    try {
      if (typeof document !== 'undefined' && document.execCommand) {
        document.execCommand(command, false, value);
      }
    } catch (error) {
      console.warn('execCommand failed:', error);
    }
    // Trigger onChange with updated HTML
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const setBlock = (block: 'P' | 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6') => {
    exec('formatBlock', block);
  };

  const setLink = () => {
    if (typeof window === 'undefined') return;
    const url = window.prompt('Enter URL');
    if (!url) return;
    exec('createLink', url);
  };

  const insertCodeBlock = () => {
    if (typeof window === 'undefined') return;
    const code = window.prompt('Enter code (will be wrapped in <pre><code>)') || '';
    if (!editorRef.current) return;
    const html = `<pre><code>${escapeHtml(code)}</code></pre>`;
    exec('insertHTML', html);
  };

  const toggleHtmlMode = () => {
    if (isHtmlMode) {
      // Going back to WYSIWYG: update editor content from textarea
      if (editorRef.current) {
        editorRef.current.innerHTML = htmlValue;
      }
      onChange(htmlValue);
      setIsHtmlMode(false);
    } else {
      // Going to HTML mode: sync textarea with current editor content
      const current = editorRef.current?.innerHTML || '';
      setHtmlValue(current);
      setIsHtmlMode(true);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50 flex flex-wrap items-center gap-2">
        <button className="px-2 py-1 text-sm border rounded" onClick={() => exec('bold')}>B</button>
        <button className="px-2 py-1 text-sm border rounded italic" onClick={() => exec('italic')}>I</button>
        <button className="px-2 py-1 text-sm border rounded underline" onClick={() => exec('underline')}>U</button>
        <div className="w-px h-6 bg-gray-300" />
        <button className="px-2 py-1 text-sm border rounded" onClick={() => setBlock('H1')}>H1</button>
        <button className="px-2 py-1 text-sm border rounded" onClick={() => setBlock('H2')}>H2</button>
        <button className="px-2 py-1 text-sm border rounded" onClick={() => setBlock('H3')}>H3</button>
        <button className="px-2 py-1 text-sm border rounded" onClick={() => setBlock('P')}>P</button>
        <div className="w-px h-6 bg-gray-300" />
        <button className="px-2 py-1 text-sm border rounded" onClick={() => exec('insertUnorderedList')}>• List</button>
        <button className="px-2 py-1 text-sm border rounded" onClick={() => exec('insertOrderedList')}>1. List</button>
        <div className="w-px h-6 bg-gray-300" />
        <button className="px-2 py-1 text-sm border rounded" onClick={() => exec('justifyLeft')}>⟸</button>
        <button className="px-2 py-1 text-sm border rounded" onClick={() => exec('justifyCenter')}>↔</button>
        <button className="px-2 py-1 text-sm border rounded" onClick={() => exec('justifyRight')}>⟹</button>
        <div className="w-px h-6 bg-gray-300" />
        <button className="px-2 py-1 text-sm border rounded" onClick={setLink}>🔗</button>
        <button className="px-2 py-1 text-sm border rounded" onClick={() => exec('removeFormat')}>Clear</button>
        <button className="px-2 py-1 text-sm border rounded" onClick={insertCodeBlock}>{'</>'}</button>
        <div className="w-px h-6 bg-gray-300" />
        <button className="px-2 py-1 text-sm border rounded bg-white hover:bg-gray-100" onClick={toggleHtmlMode}>
          {isHtmlMode ? 'Editor' : '<> HTML'}
        </button>
      </div>

      {/* Editor Area */}
      {!isHtmlMode ? (
        <div
          ref={editorRef}
          className="min-h-[240px] max-h-[480px] overflow-y-auto p-3 text-sm leading-6"
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleInput}
          data-placeholder={placeholder || 'Write your content here...'}
        />
      ) : (
        <textarea
          value={htmlValue}
          onChange={(e) => setHtmlValue(e.target.value)}
          onBlur={() => onChange(htmlValue)}
          rows={18}
          className="w-full px-3 py-2 border-0 outline-none text-sm font-mono leading-6 max-h-[480px] overflow-y-auto"
          spellCheck={false}
          placeholder={placeholder || 'Write your HTML here...'}
        />
      )}

      <style jsx>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
