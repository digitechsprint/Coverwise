'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SERVICES = [
  { href: '/motor-insurance', label: 'Motor Insurance' },
  { href: '/health-insurance', label: 'Health Insurance' },
  { href: '/wealth-management-through-mutual-funds-secure-grow-and-prosper', label: 'Wealth Management' },
  { href: '/travel-insurance-explore-the-world-with-confidence', label: 'Travel Insurance' },
  { href: '/group-health-insurance-for-employees-secure-your-workforce-strengthen-your-business', label: 'Group Health Insurance' },
  { href: '/project-workmen-compensation-insurance-protecting-your-workforce-securing-your-business', label: 'Project & Workmen Compensation' },
  { href: '/marine-transit-insurance-protecting-your-cargo-securing-your-business', label: 'Marine & Transit Insurance' },
  { href: '/fire-business-package-insurance-safeguarding-your-business-from-the-unexpected', label: 'Fire & Business Package Insurance' },
];

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/our-portfolio', label: 'Our Portfolio' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/blog', label: 'Blog' },
];

export default function SiteHeader() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo-icon.png"
              alt="Coverwise IMF LLP"
              width={49}
              height={44}
            />
            <span className="sh-wordmark text-sm font-bold text-blue-900 leading-none">
              Coverwise IMF LLP
            </span>
          </Link>

          <nav className="sh-nav-desktop items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors">
              About Us
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="sh-btn-reset sh-services-trigger-desktop flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
                onClick={() => setServicesOpen((o) => !o)}
              >
                Our Services
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {servicesOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 w-80 z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 grid grid-cols-1 gap-0.5">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.href}
                        href={s.href}
                        className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link href="/our-portfolio" className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors">
              Our Portfolio
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors">
              Contact Us
            </Link>
            <Link href="/blog" className="text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors">
              Blog
            </Link>
          </nav>

          <div className="sh-actions-desktop items-center gap-4 shrink-0">
            <a href="tel:+919958806806" className="text-sm font-semibold text-gray-700 hover:text-blue-700 transition-colors">
              +91-9958806806
            </a>
            <Link
              href="/get-a-quote"
              className="inline-flex items-center px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            className="sh-btn-reset sh-toggle-mobile p-2 text-gray-700"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="sh-mobile-panel border-t border-gray-100 bg-white px-4 py-4 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto">
          {NAV_LINKS.slice(0, 2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-700"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div>
            <button
              type="button"
              className="sh-btn-reset sh-services-trigger-mobile w-full px-2 py-2.5 text-sm font-medium text-gray-700"
              onClick={() => setMobileServicesOpen((o) => !o)}
            >
              Our Services
              <svg
                className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileServicesOpen && (
              <div className="pl-4 space-y-1 pb-2">
                {SERVICES.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block px-2 py-2 text-sm text-gray-600 hover:text-blue-700"
                    onClick={() => setMobileOpen(false)}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {NAV_LINKS.slice(2).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-2 py-2.5 text-sm font-medium text-gray-700 hover:text-blue-700"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <a href="tel:+919958806806" className="block px-2 py-2.5 text-sm font-semibold text-gray-700">
            +91-9958806806
          </a>
          <Link
            href="/get-a-quote"
            className="block mt-2 text-center px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold"
            onClick={() => setMobileOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
