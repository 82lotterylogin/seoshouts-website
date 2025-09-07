'use client';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Write your content here...'}
        rows={18}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-6"
        spellCheck={false}
      />
      <div className="mt-2 text-sm text-gray-500">
        <p>Basic editor fallback. Supports plain text and HTML.</p>
      </div>
    </div>
  );
}
