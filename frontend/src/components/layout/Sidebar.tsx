'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/lib/i18n/routing';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';

export function Sidebar() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: '/art' as const, label: t('artJewelry') },
    { href: '/shop' as const, label: t('shop') },
    { href: '/info' as const, label: t('info') },
  ];

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-6 left-6 z-50 md:hidden"
        aria-label="Open menu"
      >
        <div className="space-y-1.5">
          <div className="w-6 h-px bg-ink" />
          <div className="w-6 h-px bg-ink" />
          <div className="w-6 h-px bg-ink" />
        </div>
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-[200px] flex-col justify-between p-8 border-r border-warm-200 bg-cream z-40">
        <div>
          <Link href="/" className="block mb-12">
            <h2 className="font-heading text-xl font-light tracking-[0.3em]">
              HEEANG
            </h2>
          </Link>
          <nav className="space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block font-body text-xs tracking-widest uppercase transition-colors ${
                  pathname === link.href
                    ? 'text-ink'
                    : 'text-warm-400 hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <LanguageSwitcher />
      </aside>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-cream"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-6 right-6"
              aria-label="Close menu"
            >
              <div className="w-6 h-6 relative">
                <div className="absolute top-1/2 left-0 w-full h-px bg-ink rotate-45" />
                <div className="absolute top-1/2 left-0 w-full h-px bg-ink -rotate-45" />
              </div>
            </button>
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-heading text-2xl font-light tracking-widest"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-8">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
