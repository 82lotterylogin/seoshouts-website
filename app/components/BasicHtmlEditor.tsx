'use client';

import { useState } from 'react';

interface BasicHtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function BasicHtmlEditor({ value, onChange, placeholder }: BasicHtmlEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const insertTag = (tag: string, hasClosing: boolean = true) => {
    const textarea = document.getElementById('html-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let replacement;
    if (hasClosing) {
      replacement = `<${tag}>${selectedText}</${tag}>`;
    } else {
      replacement = `<${tag}>${selectedText}`;
    }
    
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertHtml = (html: string) => {
    const textarea = document.getElementById('html-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newValue = value.substring(0, start) + html + value.substring(end);
    onChange(newValue);

    // Restore focus
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + html.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => insertTag('strong')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-100 font-bold"
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => insertTag('em')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-100 italic"
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => insertTag('u')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-100 underline"
          title="Underline"
        >
          U
        </button>
        
        <div className="w-px h-6 bg-gray-300" />
        
        <button
          type="button"
          onClick={() => insertTag('h1')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => insertTag('h2')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => insertTag('h3')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => insertTag('p')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
          title="Paragraph"
        >
          P
        </button>
        
        <div className="w-px h-6 bg-gray-300" />
        
        <button
          type="button"
          onClick={() => insertHtml('<ul><li></li></ul>')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => insertHtml('<ol><li></li></ol>')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
          title="Numbered List"
        >
          1. List
        </button>
        
        <div className="w-px h-6 bg-gray-300" />
        
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter URL:');
            if (url) insertTag(`a href="${url}"`)
          }}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
          title="Link"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => {
            const src = prompt('Enter image URL:');
            if (src) insertHtml(`<img src="${src}" alt="Image" class="max-w-full h-auto" />`)
          }}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
          title="Image"
        >
          📷
        </button>
        <button
          type="button"
          onClick={() => insertHtml('<pre><code></code></pre>')}
          className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
          title="Code Block"
        >
          {'</>'}
        </button>
        
        <div className="w-px h-6 bg-gray-300" />
        
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`px-2 py-1 text-sm border rounded hover:bg-gray-100 ${showPreview ? 'bg-blue-100 text-blue-700' : ''}`}
          title="Toggle Preview"
        >
          👁️ Preview
        </button>
      </div>

      {/* Editor/Preview Area */}
      {!showPreview ? (
        <textarea
          id="html-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Write your HTML content here...'}
          rows={20}
          className="w-full px-3 py-2 border-0 outline-none text-sm font-mono leading-6 resize-none min-h-[400px] max-h-[480px] overflow-y-auto"
          spellCheck={false}
        />
      ) : (
        <div className="p-3 min-h-[400px] max-h-[480px] overflow-y-auto prose prose-sm max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: value || '<p class="text-gray-500">No content to preview</p>' }}
            className="prose prose-sm max-w-none"
          />
        </div>
      )}
      
      {!showPreview && (
        <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-t">
          HTML Editor - Use the toolbar buttons to insert HTML tags, or type HTML directly.
        </div>
      )}
    </div>
  );
}