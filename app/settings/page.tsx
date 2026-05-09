'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="flex-1 bg-slate-950 p-8 overflow-auto">
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your account and preferences</p>
        </div>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
            <CardDescription className="text-slate-400">Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <p className="px-4 py-2 bg-slate-800/50 rounded border border-slate-700 text-slate-200">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
              <p className="px-4 py-2 bg-slate-800/50 rounded border border-slate-700 text-slate-200 capitalize">{user?.role}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Preferences</CardTitle>
            <CardDescription className="text-slate-400">Customize your experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 text-slate-400">
              <p>Preference settings coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
