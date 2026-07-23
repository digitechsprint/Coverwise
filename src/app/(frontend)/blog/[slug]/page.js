import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ScriptRunner from '@/components/ScriptRunner';

export const revalidate = 0;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { data: blog } = await supabase
    .from('blogs')
    .select('title, excerpt, featured_image')
    .eq('slug', slug)
    .single();

  if (!blog) return {};

  return {
    title: `${blog.title} - CoverWise Blog`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.featured_image ? [blog.featured_image] : [],
    }
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !blog) {
    notFound();
  }

  return (
    <article className="bg-white min-h-screen pb-16">
      {blog.featured_image && (
        <div className="w-full h-64 sm:h-96 relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={blog.featured_image} 
            alt={blog.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/40"></div>
        </div>
      )}
      
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${blog.featured_image ? '-mt-32 relative z-10' : 'pt-16'}`}>
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12">
          <div className="text-center mb-10">
            <Link href="/blog" className="text-blue-600 hover:text-blue-500 font-semibold text-sm mb-4 inline-block">
              &larr; Back to all posts
            </Link>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
              {blog.title}
            </h1>
            <p className="text-base text-gray-500 font-medium">
              Published on {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          
          <div className="prose prose-blue prose-lg max-w-none">
            <ScriptRunner html={blog.content_html} />
          </div>
        </div>
      </div>
    </article>
  );
}
