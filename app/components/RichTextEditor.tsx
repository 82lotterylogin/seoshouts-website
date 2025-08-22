'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        preview="edit"
        hideToolbar={false}
        textareaProps={{
          placeholder: placeholder || 'Write your content here...',
          style: {
            fontSize: 14,
            lineHeight: 1.5,
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          }
        }}
        height={400}
      />
      <div className="mt-2 text-sm text-gray-500">
        <p>Supports Markdown syntax. Use the preview tab to see formatted output.</p>
        <p>HTML tags are supported for advanced formatting.</p>
      </div>
    </div>
  );
}