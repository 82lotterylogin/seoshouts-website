// app/components/StoryblokBlogPost.tsx
import { storyblokEditable } from "@storyblok/react";
import Image from 'next/image';
import Link from 'next/link';

// Simple function to render rich text content
const renderContent = (content: any): string => {
  if (typeof content === 'string') {
    return content;
  }
  
  if (!content || !content.content) {
    return '';
  }
  
  // Basic rich text rendering without external dependencies
  const processNode = (node: any): string => {
    if (node.type === 'text') {
      return node.text || '';
    }
    
    if (node.type === 'paragraph') {
      const content = node.content ? node.content.map(processNode).join('') : '';
      return `<p>${content}</p>`;
    }
    
    if (node.type === 'heading') {
      const level = node.attrs?.level || 2;
      const content = node.content ? node.content.map(processNode).join('') : '';
      return `<h${level}>${content}</h${level}>`;
    }
    
    if (node.type === 'bullet_list') {
      const items = node.content ? node.content.map(processNode).join('') : '';
      return `<ul>${items}</ul>`;
    }
    
    if (node.type === 'list_item') {
      const content = node.content ? node.content.map(processNode).join('') : '';
      return `<li>${content}</li>`;
    }
    
    if (node.type === 'ordered_list') {
      const items = node.content ? node.content.map(processNode).join('') : '';
      return `<ol>${items}</ol>`;
    }
    
    if (node.type === 'blockquote') {
      const content = node.content ? node.content.map(processNode).join('') : '';
      return `<blockquote>${content}</blockquote>`;
    }
    
    if (node.content) {
      return node.content.map(processNode).join('');
    }
    
    return '';
  };
  
  if (Array.isArray(content.content)) {
    return content.content.map(processNode).join('');
  }
  
  return '';
};

const StoryblokBlogPost = ({ blok }: { blok: any }) => {
  
  return (
    <div {...storyblokEditable(blok)}>
      {/* Article content with enhanced prose classes for proper formatting */}
      <article 
        className="container mx-auto px-4 lg:px-8 pt-4 prose prose-xl max-w-none
          prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
          prose-h1:text-4xl prose-h1:font-bold prose-h1:leading-tight prose-h1:mb-6 prose-h1:mt-4
          prose-h2:text-3xl prose-h2:font-bold prose-h2:leading-tight prose-h2:mb-4 prose-h2:mt-8 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200
          prose-h3:text-2xl prose-h3:font-semibold prose-h3:leading-tight prose-h3:mb-3 prose-h3:mt-6
          prose-h4:text-xl prose-h4:font-semibold prose-h4:mb-2 prose-h4:mt-4
          prose-p:text-lg prose-p:leading-relaxed prose-p:text-gray-700 prose-p:mb-5 prose-p:mt-0
          
          prose-ul:my-6 prose-ul:pl-6 prose-ul:list-disc prose-ul:space-y-3
          prose-ol:my-6 prose-ol:pl-6 prose-ol:list-decimal prose-ol:space-y-3
          prose-li:text-lg prose-li:leading-relaxed prose-li:text-gray-700 prose-li:marker:text-blue-600
          prose-li:pl-2 prose-li:mb-2
          
          prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 
          prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:my-8 prose-blockquote:italic 
          prose-blockquote:text-lg prose-blockquote:text-gray-800 prose-blockquote:font-medium
          prose-blockquote:rounded-r-lg prose-blockquote:shadow-sm
          
          prose-a:text-blue-600 prose-a:hover:text-blue-800 prose-a:font-medium prose-a:underline prose-a:decoration-2 prose-a:underline-offset-2
          prose-strong:font-bold prose-strong:text-gray-900
          prose-em:italic prose-em:text-gray-700
          
          prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
          prose-figure:my-8
          prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-gray-600 prose-figcaption:mt-2
          
          prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm 
          prose-code:text-red-600 prose-code:font-mono prose-code:font-semibold
          prose-pre:bg-gray-900 prose-pre:text-white prose-pre:p-6 prose-pre:rounded-lg prose-pre:my-8 
          prose-pre:overflow-x-auto prose-pre:shadow-lg
          
          prose-table:border-collapse prose-table:my-8 prose-table:w-full prose-table:border prose-table:border-gray-300
          prose-thead:bg-gray-50
          prose-th:border prose-th:border-gray-300 prose-th:p-4 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900
          prose-td:border prose-td:border-gray-300 prose-td:p-4 prose-td:text-gray-700
          prose-tbody:divide-y prose-tbody:divide-gray-200
          
          prose-hr:my-12 prose-hr:border-gray-300 prose-hr:border-t-2
          
          [&>div>*:first-child]:mt-0
          [&>div>h2]:text-3xl [&>div>h2]:font-bold [&>div>h2]:mb-4 [&>div>h2]:mt-8
          [&>div>h3]:text-2xl [&>div>h3]:font-semibold [&>div>h3]:mb-3 [&>div>h3]:mt-6
          [&>div>p]:text-lg [&>div>p]:mb-5 [&>div>p]:leading-relaxed [&>div>p]:text-gray-700
          [&>div>ul]:list-disc [&>div>ul]:pl-6 [&>div>ul]:my-6 [&>div>ul]:space-y-2
          [&>div>ol]:list-decimal [&>div>ol]:pl-6 [&>div>ol]:my-6 [&>div>ol]:space-y-2
          [&>div>li]:text-lg [&>div>li]:leading-relaxed [&>div>li]:text-gray-700 [&>div>li]:mb-2
          [&>div>blockquote]:border-l-4 [&>div>blockquote]:border-blue-600 [&>div>blockquote]:bg-blue-50 
          [&>div>blockquote]:py-6 [&>div>blockquote]:px-8 [&>div>blockquote]:my-8 [&>div>blockquote]:italic 
          [&>div>blockquote]:text-lg [&>div>blockquote]:rounded-r-lg"
      >
        <div dangerouslySetInnerHTML={{ __html: renderContent(blok.content) }} />
      </article>
    </div>
  );
};

export default StoryblokBlogPost;
