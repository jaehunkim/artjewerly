'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/admin/AuthGuard';

const navLinks = [
  { href: '/admin', label: 'Products' },
  { href: '/admin/content', label: 'Content' },
  { href: '/admin/orders', label: 'Orders' },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-8">
          <Link href="/admin" className="text-base font-semibold text-gray-900 tracking-wide">
            HEEANG Admin
          </Link>
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-gray-900 border-b-2 border-gray-900 pb-0.5'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </AuthGuard>
  );
}
