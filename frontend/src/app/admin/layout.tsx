import type { Metadata } from 'next';
import { AdminLayoutClient } from './AdminLayoutClient';

export const metadata: Metadata = {
  title: 'HEEANG Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <AdminLayoutClient>{children}</AdminLayoutClient>
      </body>
    </html>
  );
}
