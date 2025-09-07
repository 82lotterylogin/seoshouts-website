'use client';

import dynamic from 'next/dynamic';
const SimpleWysiwygInner = dynamic(() => import('./internal/SimpleWysiwygInner').then(mod => mod.default), { ssr: false });

interface SimpleWysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SimpleWysiwygEditor({ value, onChange, placeholder }: SimpleWysiwygEditorProps) {
  return (
    <SimpleWysiwygInner value={value} onChange={onChange} placeholder={placeholder} />
  );
}
