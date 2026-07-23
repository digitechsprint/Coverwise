'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BlogEditor({ params }) {
  const unwrappedParams = use(params);
  const isNew = unwrappedParams.slug === 'new';
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    featured_image: '',
    content_html: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!isNew);
  const [error, setError] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/blogs/${unwrappedParams.slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setFormData(data.blog);
          } else {
            setError('Failed to load blog post');
          }
          setIsLoading(false);
        })
        .catch(err => {
          setError('Error loading blog post');
          setIsLoading(false);
        });
    }
  }, [unwrappedParams.slug, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    
    try {
      const url = isNew ? '/api/blogs' : `/api/blogs/${unwrappedParams.slug}`;
      const method = isNew ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok && data.success) {
        alert('Blog post saved successfully!');
        if (isNew) {
          router.push(`/admin/blogs/editor/${data.blog.slug}`);
        } else {
          router.refresh();
        }
      } else {
        throw new Error(data.error || 'Failed to save');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post? This cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/blogs/${unwrappedParams.slug}`, { method: 'DELETE' });
      if (res.ok) {
        alert('Blog deleted successfully');
        router.push('/admin/blogs');
        router.refresh();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading editor...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/blogs" className="text-gray-500 hover:text-gray-700">
            &larr; Back to Blogs
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {isNew ? 'Create New Blog Post' : 'Edit Blog Post'}
          </h1>
        </div>
        {!isNew && (
          <div className="flex space-x-3">
            <Link 
              href={`/blog/${formData.slug}`} 
              target="_blank"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors"
            >
              View Live
            </Link>
            <button 
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. 5 Reasons to Get Health Insurance"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug <span className="text-gray-400 font-normal">(optional, auto-generated from title if blank)</span></label>
          <input 
            type="text" 
            name="slug" 
            value={formData.slug} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. 5-reasons-to-get-health-insurance"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
          <input 
            type="text" 
            name="featured_image" 
            value={formData.featured_image || ''} 
            onChange={handleChange} 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. https://example.com/image.jpg"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Short Excerpt</label>
          <textarea 
            name="excerpt" 
            value={formData.excerpt || ''} 
            onChange={handleChange} 
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="A short summary of the post..."
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML or Text)</label>
          <textarea 
            name="content_html" 
            value={formData.content_html} 
            onChange={handleChange} 
            required
            rows="15"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            placeholder="<p>Write your blog post content here...</p>"
          />
          <p className="mt-2 text-sm text-gray-500">You can use standard HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;b&gt;, &lt;ul&gt; for formatting.</p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={isSaving}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Blog Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
