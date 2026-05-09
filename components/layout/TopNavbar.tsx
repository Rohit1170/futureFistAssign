'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';

export function TopNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="h-16 bg-slate-950 border-b border-slate-800 px-8 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications placeholder */}
        <button className="p-2 text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 rounded-lg transition-all">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50 transition-all">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-semibold">
                  {user ? getInitials(user.email) : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.email.split('@')[0] || 'User'}</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-700">
            <DropdownMenuLabel className="text-slate-300">
              {user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-slate-100 cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-slate-300 focus:bg-slate-800 focus:text-slate-100 cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-400 focus:bg-red-950/30 focus:text-red-300 cursor-pointer"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
