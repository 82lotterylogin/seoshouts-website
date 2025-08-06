// app/components/ViewTracker.tsx
'use client'

import { useEffect } from 'react';

interface ViewTrackerProps {
  articleSlug: string;
}

export default function ViewTracker({ articleSlug }: ViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        setTimeout(async () => {
          console.log(`📊 Article view tracked: ${articleSlug}`);
          // Here you would call your analytics API
        }, 2000);
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    };

    trackView();
  }, [articleSlug]);

  return null;
}
