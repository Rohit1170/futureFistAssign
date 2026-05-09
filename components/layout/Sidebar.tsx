'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0',
  },
  {
    label: 'Chat',
    href: '/dashboard',
    icon: 'M12 21a9.004 9.004 0 0 0 8.716 -5.352m-15.433 -4.915a9 9 0 1 1 17.434 0',
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: 'M3 3v18h18',
  },
  {
    label: 'Upload',
    href: '/upload',
    icon: 'M7 18c-.5 1.5 -2 3 -4 3s-3.5 -1.5 -4 -3 1.5 -2 3 -2 3.5 1.5 4 3m6 -15c.5 -1.5 2 -3 4 -3s3.5 1.5 4 3 -1.5 2 -3 2 -3.5 -1.5 -4 -3',
  },
  {
    label: 'History',
    href: '/history',
    icon: 'M12 3c-.1 0 -1.5 0 -2 .5-.5 .5 -3 3 -3 3l-6 6',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: 'M12 3v18m4.22 -18.97a2.11 2.11 0 0 1 1.54 .63c.55 .55 .67 1.41 .36 2.12 -.32 .71 .27 1.49 1.01 1.49H21a2 2 0 0 1 0 4h-.29c.74 0 1.33 .78 1.01 1.49 -.31 .71 -.19 1.57 .36 2.12a2.11 2.11 0 0 1 -1.54 3.63h-.29c-.74 0 -1.33 .78 -1.01 1.49 .31 .71 .19 1.57 -.36 2.12a2.11 2.11 0 0 1 -1.54 .63M2.22 12.97a2.11 2.11 0 0 0 -1.54 .63c-.55 .55 -.67 1.41 -.36 2.12 .32 .71 -.27 1.49 -1.01 1.49H3a2 2 0 0 0 0 4h.29c.74 0 1.33 .78 1.01 1.49 -.31 .71 -.19 1.57 .36 2.12a2.11 2.11 0 0 0 1.54 .63',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-bold text-white">AI Analytics</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/dashboard' && pathname.startsWith('/dashboard'));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/50'
              )}
            >
              <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 p-4 text-xs text-slate-500">
        <p>© 2024 AI Analytics. All rights reserved.</p>
      </div>
    </aside>
  );
}
