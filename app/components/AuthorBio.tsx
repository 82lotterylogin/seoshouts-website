// app/components/AuthorBio.tsx
import Image from 'next/image';
import Link from 'next/link';

const AuthorBio = ({ author }: { author: any }) => {
  const authorData = author?.content || {
    name: 'Rohit Sharma',
    slug: 'rohit-sharma',
    picture: { filename: '/images/team/rohit-sharma.jpg' },
  };

  return (
    <section className="py-4">
      <div className="w-full">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex flex-col md:flex-row items-start gap-4 min-w-0">
            
            {/* Author Photo */}
            <div className="flex-shrink-0 relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden ring-2 ring-blue-200/50 shadow-lg hover:ring-blue-300/60 transition-all duration-300">
                {authorData.picture?.filename ? (
                  <Image
                    src={authorData.picture.filename}
                    alt={authorData.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg md:text-xl">
                      {authorData.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Compact Verified Badge */}
              <div className="absolute -bottom-1 -right-1 z-10">
                <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-white rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Author Info */}
            <div className="flex-1 min-w-0">
              
              {/* Compact Staff Badge */}
              <div className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-3">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                <span>{authorData.job_title ? `${authorData.job_title}` : 'Author'}</span>
              </div>
              
              {/* Compact Author Name */}
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 leading-tight">
                {authorData.name}
              </h3>
              
              {/* Compact Job Title */}
              <p className="text-sm text-gray-600 mb-3">
                {authorData.job_title || 'Author'} at <span className="text-blue-600 font-semibold">SEO Shouts</span>
              </p>
              
              {/* Compact Bio Text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-2">
                {authorData.bio || `${authorData.name} is a seasoned SEO professional with over 13 years of experience helping businesses achieve top rankings on search engines.`}
              </p>
              
              {/* Compact Action Buttons */}
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3">
                <Link 
                  href={`/authors/${authorData.slug}`}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg no-underline min-w-0"
                >
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span className="whitespace-nowrap">View Profile</span>
                </Link>
                
                {/* Compact Social Links */}
                <div className="flex items-center gap-2 min-w-0">
                  {authorData.twitter_url && (
                    <a 
                      href={authorData.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-200 shadow-sm hover:shadow-md"
                      aria-label="Twitter"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                      </svg>
                    </a>
                  )}
                  
                  {authorData.linkedin_url && (
                    <a 
                      href={authorData.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors duration-200 shadow-sm hover:shadow-md"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
                      </svg>
                    </a>
                  )}

                  {authorData.website_url && (
                    <a 
                      href={authorData.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                      aria-label="Website"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                      </svg>
                    </a>
                  )}
                  
                  {authorData.email && (
                    <a 
                      href={`mailto:${authorData.email}`}
                      className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center hover:bg-purple-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                      aria-label="Email"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorBio;
