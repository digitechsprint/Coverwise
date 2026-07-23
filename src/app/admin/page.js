import Link from 'next/link';
import { getAllPages } from '@/lib/db';

export default async function AdminDashboard() {
  const pages = await getAllPages();
  const totalPages = pages.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Pages</p>
            <p className="text-3xl font-bold text-gray-900">{totalPages}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
          <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Blog Posts</p>
            <p className="text-3xl font-bold text-gray-900">0</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center space-x-4 transition-transform hover:scale-[1.02]">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
            <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Status</p>
            <p className="text-xl font-bold text-gray-900">Live & Syncing</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/admin/pages" className="group flex items-center p-5 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md hover:bg-blue-50/30 transition-all">
            <div className="flex-1">
              <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-700">Edit Pages</h4>
              <p className="text-sm text-gray-500 mt-1">Visually edit Home, About, Services, etc.</p>
            </div>
            <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link href="/admin/blogs" className="group flex items-center p-5 border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md hover:bg-indigo-50/30 transition-all opacity-50 cursor-not-allowed">
            <div className="flex-1">
              <h4 className="text-base font-semibold text-gray-900 group-hover:text-indigo-700">Manage Blogs</h4>
              <p className="text-sm text-gray-500 mt-1">Coming soon with Supabase integration.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
