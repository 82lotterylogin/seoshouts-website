'use client';

import { useState } from 'react';
import {
  Editor,
  EditorProvider,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnLink,
  BtnNumberedList,
  BtnBulletList,
  BtnUndo,
  BtnRedo,
  Separator,
  BtnClearFormatting,
  BtnStyles,
} from 'react-simple-wysiwyg';

export interface InnerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SimpleWysiwygInner({ value, onChange, placeholder }: InnerProps) {
  const [showHtml, setShowHtml] = useState(false);

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <EditorProvider>
        {!showHtml ? (
          <Editor value={value} onChange={(e: any) => onChange(e?.target?.value ?? '')} placeholder={placeholder || 'Write your content here...'}>
            <Toolbar>
              <BtnBold />
              <BtnItalic />
              <BtnUnderline />
              <Separator />
              <BtnNumberedList />
              <BtnBulletList />
              <Separator />
              <BtnStyles />
              <BtnLink />
              <Separator />
              <BtnClearFormatting />
              <Separator />
              <BtnUndo />
              <BtnRedo />
              <Separator />
              <button
                type="button"
                onClick={() => setShowHtml(true)}
                className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100"
                title="Edit HTML source"
              >
                {'<>'} HTML
              </button>
            </Toolbar>
          </Editor>
        ) : (
          <div className="p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">HTML source (advanced)</span>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => setShowHtml(false)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100"
                >
                  Back to Editor
                </button>
              </div>
            </div>
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'Write your HTML here...'}
              rows={18}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-6 max-h-[480px] overflow-y-auto"
              spellCheck={false}
            />
            <p className="mt-2 text-xs text-gray-500">Tip: You can paste code blocks using &lt;pre&gt;&lt;code&gt;...&lt;/code&gt;&lt;/pre&gt;.</p>
          </div>
        )}
      </EditorProvider>

      <div className="mt-2 text-sm text-gray-500 p-2 bg-gray-50 border-t">
        <p>WYSIWYG editor with headings (Styles), lists, links, undo/redo. Toggle HTML to edit raw code.</p>
      </div>

      <style jsx global>{`
        /* Make the content area scrollable within a fixed height */
        .rsw-editor { max-height: 520px; overflow: hidden; }
        .rsw-ce { max-height: 440px; overflow-y: auto; padding: 8px; }
      `}</style>
    </div>
  );
}
