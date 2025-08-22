// app/components/ReadingProgress.tsx
'use client'

import { useState, useEffect } from 'react';

const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      
      // Try to find author box to use as 100% completion point
      const authorBox = document.querySelector('[class*="author"]') || 
                        document.querySelector('.author-bio') ||
                        document.querySelector('#author') ||
                        document.getElementById('author-section');
      
      let targetElement = authorBox;
      
      // If no author box found, use document height
      if (!targetElement) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        const clampedProgress = Math.min(100, Math.max(0, scrollPercent));
        setProgress(clampedProgress);
      } else {
        // Calculate progress based on author box position
        const targetPosition = targetElement.offsetTop;
        const scrollPercent = Math.min(100, Math.max(0, (scrollTop / targetPosition) * 100));
        setProgress(scrollPercent);
      }
      
      setIsVisible(scrollTop > 100);
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {isVisible && (
        <div className="fixed bottom-24 lg:bottom-20 right-4 lg:right-8 z-[60]">
          {/* Reading Progress Circle */}
          <div className="w-16 h-16 bg-white rounded-full shadow-xl border border-gray-200 relative flex items-center justify-center">
            <svg className="absolute w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray="100"
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-orange-500"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={`${progress}, 100`}
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="text-xs font-bold text-gray-700 z-10 relative">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ReadingProgress;
