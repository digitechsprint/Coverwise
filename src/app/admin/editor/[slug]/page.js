'use client';

import { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VisualEditor({ params }) {
  const unwrappedParams = use(params);
  const slug = unwrappedParams.slug;
  
  const [isSaving, setIsSaving] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeRef = useRef(null);
  const router = useRouter();

  // The URL of the page to edit
  const pageUrl = slug === 'home' ? '/' : `/${slug}`;

  useEffect(() => {
    // When the iframe loads, we inject our editing logic
    const handleIframeLoad = () => {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;

      try {
        const doc = iframe.contentWindow.document;
        
        // Wait for the ScriptRunner to inject the HTML
        const initEditor = () => {
          const root = doc.getElementById('coverwise-content-root');
          if (!root) {
            setTimeout(initEditor, 500);
            return;
          }

          // Make all text elements editable
          const editableTags = 'h1, h2, h3, h4, h5, h6, p, span, a, li, b, strong, i, em';
          const elements = root.querySelectorAll(editableTags);
          
          elements.forEach(el => {
            // Only make it editable if it has text (ignore empty structural spans)
            if (el.textContent && el.textContent.trim().length > 0) {
              el.setAttribute('contenteditable', 'true');
              
              // Add visual cues for hovering over editable text
              el.addEventListener('mouseenter', () => {
                el.style.outline = '2px dashed #3b82f6';
                el.style.outlineOffset = '2px';
                el.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                el.style.cursor = 'text';
              });
              
              el.addEventListener('mouseleave', () => {
                el.style.outline = 'none';
                el.style.backgroundColor = 'transparent';
              });
              
              // Prevent links from navigating while editing
              if (el.tagName.toLowerCase() === 'a') {
                el.addEventListener('click', (e) => {
                  e.preventDefault();
                });
              }
            }
          });
          
          setIsLoaded(true);
        };
        
        initEditor();
      } catch (err) {
        console.error("Could not access iframe contents (CORS or other error)", err);
      }
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener('load', handleIframeLoad);
    }
    
    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener('load', handleIframeLoad);
      }
    };
  }, [slug]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const iframe = iframeRef.current;
      const doc = iframe.contentWindow.document;
      const root = doc.getElementById('coverwise-content-root');
      
      if (!root) throw new Error("Could not find content root");
      
      // Clean up our editor attributes before saving
      const clone = root.cloneNode(true);
      const elements = clone.querySelectorAll('[contenteditable]');
      elements.forEach(el => {
        el.removeAttribute('contenteditable');
        el.style.outline = '';
        el.style.outlineOffset = '';
        el.style.backgroundColor = '';
        el.style.cursor = '';
      });
      
      const newHtml = clone.innerHTML;
      
      // Send to our API
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, html: newHtml })
      });
      
      if (res.ok) {
        alert('Page saved successfully!');
        router.refresh();
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      console.error(err);
      alert('Error saving page: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Editor Toolbar */}
      <div className="bg-white px-6 py-4 border border-gray-200 rounded-t-xl flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <Link href="/admin/pages" className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Visual Editor: <span className="text-blue-600">{slug}</span>
            </h2>
            <p className="text-sm text-gray-500">Click on any text in the preview below to edit it.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <a href={pageUrl} target="_blank" rel="noreferrer" className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
            View Live
          </a>
          <button 
            onClick={handleSave}
            disabled={!isLoaded || isSaving}
            className="inline-flex items-center px-5 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
            {!isSaving && (
              <svg className="ml-2 -mr-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Visual Workspace */}
      <div className="flex-1 bg-gray-200 rounded-b-xl border-x border-b border-gray-200 overflow-hidden relative">
        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-medium text-gray-600">Initializing Visual Editor...</p>
          </div>
        )}
        <iframe 
          ref={iframeRef}
          src={pageUrl} 
          className="w-full h-full bg-white shadow-inner"
          title="Visual Editor Preview"
        />
      </div>
    </div>
  );
}
