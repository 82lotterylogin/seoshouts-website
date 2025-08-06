// app/components/RelatedPosts.tsx
import { getAllStories } from '../lib/storyblok';
import Link from 'next/link';
import Image from 'next/image';

const RelatedPosts = async ({ currentSlug, category }: { currentSlug: string, category: string }) => {
  const allPosts = await getAllStories("blog_post");
  const relatedPosts = allPosts
    .filter((post: any) => post.slug !== currentSlug && post.content.category === category)
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="bg-gradient-to-r from-gray-50 to-blue-50/30 py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Continue Reading</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore more expert insights and strategies to accelerate your SEO success
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {relatedPosts.map((post: any) => (
            <article key={post.uuid} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="relative h-48 overflow-hidden">
                <Link href={`/blog/${post.slug}`}>
                  <Image
                    src={post.content.image?.filename || '/placeholder-blog.jpg'}
                    alt={post.content.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </Link>
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {post.content.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.content.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.content.excerpt || 'Discover proven SEO strategies and insights that drive real results...'}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">RS</span>
                    </div>
                    <span>Rohit Sharma</span>
                  </div>
                  <span>5 min read</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl no-underline"
          >
            <span>View All Articles</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RelatedPosts;
