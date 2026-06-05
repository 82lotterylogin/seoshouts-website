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
    const header = (document.querySelector('header[class*="sticky"]') ||
                   document.querySelector('header')) as HTMLElement | null;
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
    <div className="ba-toc-card">
      <button
        className="ba-toc-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        type="button"
      >
        <div className="ba-toc-btn-l">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--blue)', flexShrink: 0 }}>
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          <span className="ba-toc-btn-title">Table of Contents</span>
        </div>
        <span className={`ba-toc-chev${isOpen ? '' : ' collapsed'}`} aria-hidden="true">
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </button>

      <div className={`ba-toc-list${isOpen ? '' : ' collapsed'}`}>
        {headings.length > 0 ? (
          headings.map((heading, index) => (
            <button
              key={heading.id}
              className={`ba-toc-link${activeId === heading.id ? ' active' : ''}`}
              onClick={(e) => { e.preventDefault(); scrollToHeading(heading.id); }}
              type="button"
            >
              <span className="ba-toc-num">{String(index + 1).padStart(2, '0')}</span>
              <span>{heading.title}</span>
            </button>
          ))
        ) : (
          <div style={{ padding: '1rem 1.15rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: 'var(--gray-4)', letterSpacing: '0.06em' }}>
            No headings found
          </div>
        )}
      </div>
    </div>
  );
};

export default TableOfContents;
