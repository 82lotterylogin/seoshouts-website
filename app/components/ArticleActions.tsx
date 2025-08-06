// app/components/ArticleActions.tsx
'use client'

import { useState } from 'react';

const ArticleActions = ({ story }: { story: any }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(247);

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Quick Actions</h3>
            <p className="text-sm text-white/80">Interact with this article</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 space-y-4">
        
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
            liked 
              ? 'bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 shadow-lg' 
              : 'bg-gray-50 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 border-2 border-transparent hover:border-red-200'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            liked 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-110' 
              : 'bg-white text-red-500 group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-pink-500 group-hover:text-white shadow-md'
          }`}>
            <svg className="w-6 h-6" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <span className={`text-base font-semibold block transition-colors duration-300 ${
              liked ? 'text-red-600' : 'text-gray-900 group-hover:text-red-600'
            }`}>
              {liked ? 'Liked!' : 'Like this article'}
            </span>
            <span className="text-sm text-gray-500">
              {likeCount.toLocaleString()} people found this helpful
            </span>
          </div>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmark}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
            bookmarked 
              ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg' 
              : 'bg-gray-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 border-2 border-transparent hover:border-blue-200'
          }`}
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            bookmarked 
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg scale-110' 
              : 'bg-white text-blue-500 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-indigo-500 group-hover:text-white shadow-md'
          }`}>
            <svg className="w-6 h-6" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <span className={`text-base font-semibold block transition-colors duration-300 ${
              bookmarked ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'
            }`}>
              {bookmarked ? 'Bookmarked!' : 'Bookmark Article'}
            </span>
            <span className="text-sm text-gray-500">Save for later reading</span>
          </div>
        </button>

        {/* Share Button */}
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 border-2 border-transparent hover:border-green-200 transition-all duration-300 group">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-gradient-to-r group-hover:from-green-500 group-hover:to-emerald-500 group-hover:text-white shadow-md transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <span className="text-base font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-300 block">
              Share Article
            </span>
            <span className="text-sm text-gray-500">Spread the knowledge</span>
          </div>
        </button>

        {/* Print Button */}
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 border-2 border-transparent hover:border-yellow-200 transition-all duration-300 group">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-yellow-500 group-hover:bg-gradient-to-r group-hover:from-yellow-500 group-hover:to-orange-500 group-hover:text-white shadow-md transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <span className="text-base font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors duration-300 block">
              Print Article
            </span>
            <span className="text-sm text-gray-500">Get physical copy</span>
          </div>
        </button>
      </div>

      {/* Article Stats */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100">
        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          Article Stats
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600 mb-1">2.4k</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Views</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600 mb-1">94%</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Helpful</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600 mb-1">18</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Shares</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600 mb-1">5m</div>
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Read Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleActions;
