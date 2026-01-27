// app/components/TableOfContents.tsx
'use client'

import { useState, useEffect } from 'react';

const TableOfContents = ({ content }: { content: any }) => {
  const [headings, setHeadings] = useState<Array<{id: string, title: string, level: number}>>([]);
  const [activeId, setActiveId] = useState('');
  const [isOpen, setIsOpen] = useState(true); // Open by default for better UX

  useEffect(() => {
    // DOM extraction method (what was working before)
    const timer = setTimeout(() => {
      const slugify = (text: string) => text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').trim();
      
      // Extract only H2 headings from the rendered article content
      const articleElement = document.querySelector('article.prose');
      const headingElements = articleElement ? Array.from(articleElement.querySelectorAll('h2')) : [];
      
      const extractedHeadings = headingElements.map((heading, index) => {
        const text = heading.textContent || `heading-${index}`;
        const id = heading.id || slugify(text);
        heading.id = id; // Set ID on element for scrolling
        return { id, title: text, level: 2 };
      });
      
      setHeadings(extractedHeadings);
    }, 500);

    return () => clearTimeout(timer);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px" });

    headings.forEach(heading => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => {
      headings.forEach(heading => {
        const element = document.getElementById(heading.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);

  // ✅ ENHANCED: Custom scroll function with header offset
  const scrollToHeading = (headingId: string) => {
    console.log('Scrolling to heading:', headingId); // Debug log
    const element = document.getElementById(headingId);
    if (!element) {
      console.log('Element not found:', headingId);
      return;
    }

    // Calculate header height more precisely
    const header = document.querySelector('header[class*="sticky"]') || 
                   document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 80;
    
    // Add extra padding for breathing room
    const offset = headerHeight + 40; // Reduced from 80 to 40
    
    // Get element position
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    // Smooth scroll to calculated position
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-lg lg:shadow-lg fixed bottom-4 left-4 right-4 lg:relative lg:static z-40 lg:z-auto max-w-sm lg:max-w-none mx-auto lg:mx-0">
      {/* Header with Toggle Button */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path>
          </svg>
          Table of Contents
        </h3>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Collapse Table of Contents' : 'Expand Table of Contents'}
          className="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
        >
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Navigation Content */}
      {isOpen && (
        <nav className="p-4 max-h-[50vh] overflow-y-auto">
          {headings.length > 0 ? (
            <ul className="space-y-1">
              {headings.map((heading, index) => (
                <li key={heading.id}>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Button clicked for:', heading.id);
                      scrollToHeading(heading.id);
                    }}
                    className={`block text-sm py-1.5 px-3 rounded-lg transition-colors duration-200 w-full text-left flex items-start gap-2 ${
                      activeId === heading.id
                        ? 'text-blue-600 font-semibold bg-blue-50 border-l-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-xs font-mono mt-0.5 flex-shrink-0 ${
                      activeId === heading.id ? 'text-blue-500' : 'text-gray-400'
                    }`}>
                      {(index + 1).toString().padStart(2, '0')}.
                    </span>
                    <span className="flex-1">{heading.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500 py-4">
              <p className="text-sm">No headings found</p>
            </div>
          )}
        </nav>
      )}
    </div>
  );
};

export default TableOfContents;
