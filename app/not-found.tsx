import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <h1 className="text-8xl font-bold text-indigo-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Go Back Home
          </Link>
          
          <div className="text-sm text-gray-500">
            <Link href="/blog" className="text-indigo-600 hover:underline mr-4">
              Browse Blog
            </Link>
            <Link href="/services" className="text-indigo-600 hover:underline mr-4">
              Our Services
            </Link>
            <Link href="/tools" className="text-indigo-600 hover:underline">
              SEO Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}