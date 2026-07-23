export default function AdminBlogsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Blog Posts</h1>
      </div>

      <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Blog Management Coming Soon</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Blog management will be enabled in Phase 3 when we connect the website to Supabase. This will allow you to create, edit, and delete dynamic blog posts easily.
        </p>
      </div>
    </div>
  );
}
