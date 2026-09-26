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
    // These CTA buttons come from the imported WordPress markup with href="#"
    // (dead links, or leftover slider/theme defaults). Route them by their
    // visible text since that's the only stable thing about them.
    const WHATSAPP_URL = 'https://wa.me/919958806806';
    const QUOTE_FORM_URL = '/get-a-quote#quote-form';
    const BUTTON_ACTIONS = {
      'get a quote today': () => { window.location.href = QUOTE_FORM_URL; },
      'get started': () => { window.location.href = QUOTE_FORM_URL; },
      'get a free quote': () => { window.location.href = QUOTE_FORM_URL; },
      'talk to an advisor': () => { window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer'); },
      'locate an agent': () => { window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer'); },
      'connect with gaurav': () => { window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer'); },
      'contact us': () => { window.location.href = '/contact'; },
    };

    const handleQuoteClick = (e) => {
      const target = e.target;
      const link = target.tagName === 'A' ? target : target.closest && target.closest('a');
      if (!link) return;

      if (link.href && link.href.includes('get-a-quote')) {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = QUOTE_FORM_URL;
        return;
      }

      const text = link.innerText && link.innerText.trim().toLowerCase();
      const action = text && BUTTON_ACTIONS[text];
      if (action) {
        e.preventDefault();
        e.stopPropagation();
        action();
      }
    };

    document.addEventListener('click', handleQuoteClick, true);

    // Elementor's own accordion widget JS doesn't initialize in this port, so
    // .elementor-tab-content stays hidden (display:none from the base CSS)
    // no matter what's clicked. Toggle it manually, matching the classic
    // accordion behavior: opening one item closes the others.
    const handleAccordionClick = (e) => {
      const title = e.target.closest && e.target.closest('.elementor-tab-title');
      if (!title) return;
      const accordion = title.closest('.elementor-accordion');
      if (!accordion) return;
      e.preventDefault();
      // A leftover Elementor script partially initializes and fights this
      // handler for the same click, immediately re-closing what we just
      // opened. Run in the capture phase and stop the event outright so
      // nothing downstream (including that script's own listener) sees it.
      e.stopPropagation();
      e.stopImmediatePropagation();

      const getContent = (t) => {
        const id = t.getAttribute('aria-controls');
        return id ? document.getElementById(id) : t.nextElementSibling;
      };

      const isOpen = title.classList.contains('elementor-active');

      // A plugin stylesheet has `[hidden] { display: none !important; }`, which
      // beats the widget's own (non-!important) `display: none`. So opening a
      // panel means clearing the `hidden` attribute *and* setting an inline
      // display, not just one or the other.
      const setOpen = (el, open) => {
        el.hidden = !open;
        el.style.display = open ? 'block' : 'none';
      };

      accordion.querySelectorAll('.elementor-tab-title.elementor-active').forEach((openTitle) => {
        if (openTitle === title) return;
        openTitle.classList.remove('elementor-active');
        openTitle.setAttribute('aria-expanded', 'false');
        const openContent = getContent(openTitle);
        if (openContent) setOpen(openContent, false);
      });

      title.classList.toggle('elementor-active', !isOpen);
      title.setAttribute('aria-expanded', String(!isOpen));
      const content = getContent(title);
      if (content) setOpen(content, !isOpen);
    };

    document.addEventListener('click', handleAccordionClick, true);

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
      document.removeEventListener('click', handleAccordionClick, true);
    };
  }, []);

  return <div id="coverwise-content-root" ref={containerRef} className={bodyClass} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
