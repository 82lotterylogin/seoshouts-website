'use client';

import dynamic from 'next/dynamic';

interface RichWysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Dynamically load TinyMCE Editor only on the client to avoid SSR issues
const TinyMCEEditor = dynamic(
  () => import('@tinymce/tinymce-react').then(mod => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="border border-gray-300 rounded-md p-4 min-h-[300px] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-500">Loading editor...</p>
        </div>
      </div>
    )
  }
);

export default function RichWysiwygEditor({ value, onChange, placeholder }: RichWysiwygEditorProps) {
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'no-api-key';

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <TinyMCEEditor
        apiKey={apiKey}
        value={value}
        onEditorChange={(content: string) => onChange(content)}
        init={{
          menubar: false,
          height: 480,
          branding: false,
          statusbar: true,
          resize: false,
          placeholder: placeholder || 'Write your content here...',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
            'searchreplace', 'visualblocks', 'code', 'fullscreen', 'insertdatetime', 'media',
            'table', 'help', 'wordcount', 'codesample'
          ],
          toolbar:
            'undo redo | blocks | bold italic underline strikethrough | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | link image table | ' +
            'removeformat | code | fullscreen',
          block_formats: 'Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6',
          content_style:
            'body { font-family: -apple-system, BlinkMacSystemFont,\n' +
            'Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Helvetica Neue, Arial, sans-serif;\n' +
            'font-size:14px; line-height:1.6; padding: 8px; }\n' +
            'img { max-width: 100%; height: auto; border-radius: 6px; }',
        }}
      />
    </div>
  );
}
