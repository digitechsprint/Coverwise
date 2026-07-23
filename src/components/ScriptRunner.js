"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function ScriptRunner({ html, bodyClass }) {
  const containerRef = useRef(null);
  const hasRunRef = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    hasRunRef.current = false;
  }, [pathname]);

  useEffect(() => {
    if (!containerRef.current || hasRunRef.current) return;
    hasRunRef.current = true;
    
    // Set body class for elementor scoping
    if (bodyClass) {
      document.body.className = bodyClass;
    }

    const container = containerRef.current;
    const scripts = container.querySelectorAll('script');

    
    scripts.forEach((oldScript) => {
      // Don't re-run scripts that are already running or broken
      if (oldScript.hasAttribute('data-executed')) return;
      
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      newScript.setAttribute('data-executed', 'true');
      
      // Replace old script with new one so it executes
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });
  }, [pathname, html, bodyClass]);

  return <div ref={containerRef} className={bodyClass} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
