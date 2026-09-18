import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export const revalidate = 3600; // invalidated immediately on save via revalidatePath

export async function generateMetadata() {
  return {
    title: 'Blog - CoverWise IMF',
    description: 'Read the latest insights and news on insurance and personal finance from CoverWise.',
  };
}

export default async function BlogPage() {
  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('slug, title, excerpt, featured_image, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching blogs:', error);
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-gray-500">
            Insights, advice, and updates on health, motor, and business insurance to keep you informed and protected.
          </p>
        </div>

        {(!blogs || blogs.length === 0) ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
            <p className="mt-2 text-gray-500">Check back soon for our latest articles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article key={blog.slug} className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {blog.featured_image ? (
                  <div className="flex-shrink-0 h-48 w-full relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="h-full w-full object-cover" src={blog.featured_image} alt={blog.title} />
                  </div>
                ) : (
                  <div className="flex-shrink-0 h-48 w-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-600 mb-2">
                      {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <Link href={`/blog/${blog.slug}`} className="block mt-2">
                      <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      {blog.excerpt && (
                        <p className="mt-3 text-base text-gray-500 line-clamp-3">
                          {blog.excerpt}
                        </p>
                      )}
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <Link href={`/blog/${blog.slug}`} className="text-base font-semibold text-blue-600 hover:text-blue-500">
                      Read full article &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
