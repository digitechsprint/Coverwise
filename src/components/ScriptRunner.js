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
      
      const scriptContent = oldScript.innerHTML;
      window.__executedScripts = window.__executedScripts || new Set();
      
      if (scriptContent) {
        if (window.__executedScripts.has(scriptContent)) return;
        window.__executedScripts.add(scriptContent);
      } else if (oldScript.src) {
        if (window.__executedScripts.has(oldScript.src)) return;
        window.__executedScripts.add(oldScript.src);
      }
      
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
      newScript.async = false;
      
      if (oldScript.innerHTML) {
        const type = oldScript.getAttribute('type');
        const isJS = !type || type === 'text/javascript' || type === 'application/javascript' || type === 'module';
        
        if (isJS) {
          // Wrap in a block to prevent 'has already been declared' errors for let/const
          // when inline scripts are executed multiple times (e.g. strict mode or route changes).
          // var declarations will still escape the block as expected by many WP plugins.
          newScript.appendChild(document.createTextNode(`{\n${oldScript.innerHTML}\n}`));
        } else {
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
        }
      }
      newScript.setAttribute('data-executed', 'true');
      
      // Replace old script with new one so it executes
      oldScript.parentNode.replaceChild(newScript, oldScript);
    });

    // Dispatch load events to trigger plugins like Revolution Slider
    // that wait for these events, which have already passed during React hydration.
    setTimeout(() => {
      window.dispatchEvent(new Event('DOMContentLoaded'));
      document.dispatchEvent(new Event('DOMContentLoaded'));
      window.dispatchEvent(new Event('load'));
      if (window.SR7 && window.SR7.F && window.SR7.F.init) {
        window.SR7.F.init();
      }
    }, 100);
  }, [pathname, html, bodyClass]);

  useEffect(() => {
    // Force redirect for 'Get a Quote Today' buttons, overriding any slider or theme defaults
    const handleQuoteClick = (e) => {
      const target = e.target;
      if (
        (target.tagName === 'A' && target.innerText && target.innerText.trim() === 'Get a Quote Today') ||
        (target.closest && target.closest('a') && target.closest('a').innerText && target.closest('a').innerText.trim() === 'Get a Quote Today') ||
        (target.tagName === 'A' && target.href && target.href.includes('get-a-quote'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/get-a-quote#quote-form';
      } else if (
        (target.tagName === 'A' && target.innerText && target.innerText.trim().toLowerCase() === 'talk to an advisor') ||
        (target.closest && target.closest('a') && target.closest('a').innerText && target.closest('a').innerText.trim().toLowerCase() === 'talk to an advisor')
      ) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = 'tel:+919958806806';
      } else if (
        (target.tagName === 'A' && target.innerText && target.innerText.trim().toLowerCase() === 'contact us') ||
        (target.closest && target.closest('a') && target.closest('a').innerText && target.closest('a').innerText.trim().toLowerCase() === 'contact us')
      ) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/contact';
      } else if (
        (target.tagName === 'A' && target.innerText && target.innerText.trim().toLowerCase() === 'locate an agent') ||
        (target.closest && target.closest('a') && target.closest('a').innerText && target.closest('a').innerText.trim().toLowerCase() === 'locate an agent')
      ) {
        e.preventDefault();
        e.stopPropagation();
        window.open('https://wa.me/919958806806', '_blank', 'noopener,noreferrer');
      } else if (
        (target.tagName === 'A' && target.innerText && target.innerText.trim().toLowerCase() === 'connect with gaurav') ||
        (target.closest && target.closest('a') && target.closest('a').innerText && target.closest('a').innerText.trim().toLowerCase() === 'connect with gaurav')
      ) {
        e.preventDefault();
        e.stopPropagation();
        window.open('https://wa.me/919958806806', '_blank', 'noopener,noreferrer');
      } else if (
        (target.tagName === 'A' && target.innerText && target.innerText.trim().toLowerCase() === 'get started') ||
        (target.closest && target.closest('a') && target.closest('a').innerText && target.closest('a').innerText.trim().toLowerCase() === 'get started')
      ) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/get-a-quote#quote-form';
      }
    };
    
    document.addEventListener('click', handleQuoteClick, true);

    // Auto-scroll to form if hash is present
    if (window.location.hash === '#quote-form') {
      setTimeout(() => {
        const formElement = document.querySelector('.gva-element-gva-tab-contact-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 800);
    }

    return () => {
      document.removeEventListener('click', handleQuoteClick, true);
    };
  }, []);

  return <div id="coverwise-content-root" ref={containerRef} className={bodyClass} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
