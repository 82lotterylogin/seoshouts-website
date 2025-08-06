// app/components/AuthorBio.tsx
import Image from 'next/image';
import Link from 'next/link';

const AuthorBio = ({ author }: { author: any }) => {
  const authorData = author?.content || {
    name: 'Rohit Sharma',
    slug: 'rohit-sharma',
    picture: null,
  };

  return (
    <section className="py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-start gap-6">
            
            {/* Author Photo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-3 ring-blue-200 shadow-lg">
                {authorData.picture?.filename ? (
                  <Image
                    src={authorData.picture.filename}
                    alt={authorData.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl md:text-3xl">
                      {authorData.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Verified Badge */}
              <div className="relative -mt-3 ml-20 md:ml-24">
                <div className="w-8 h-8 bg-green-500 border-3 border-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Author Info */}
            <div className="flex-1 min-w-0">
              
              {/* Staff Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                Founder and Author
              </div>
              
              {/* Author Name */}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {authorData.name}
              </h3>
              
              {/* Job Title */}
              <p className="text-lg font-medium text-blue-600 mb-4">
                Author at <span className="text-blue-700 font-semibold">SEO Shouts</span>
              </p>
              
              {/* Bio Text */}
              <p className="text-gray-700 leading-relaxed mb-6 text-base">
                {authorData.name} is a seasoned SEO professional with over 13 years of experience helping businesses achieve top rankings on search engines. He specializes in technical SEO, content strategy, and local search optimization.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link 
                  href={`/authors/${authorData.slug}`}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 no-underline"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Read Full Bio
                </Link>
                
                {/* Social Links */}
                <div className="flex items-center gap-3">
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                    aria-label="Twitter"
                  >
                    <svg className="w-4 h-4 text-gray-600 hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-4 h-4 text-gray-600 hover:text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
                    </svg>
                  </a>
                  
                  <a 
                    href="#" 
                    className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md"
                    aria-label="Email"
                  >
                    <svg className="w-4 h-4 text-gray-600 hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </a>
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
