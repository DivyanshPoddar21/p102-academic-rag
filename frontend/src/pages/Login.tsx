import React, { useState } from 'react';
import { Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';

interface Props {
  onLoginSuccess: (username: string) => void;
}

export const LoginPage: React.FC<Props> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('divyansh');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'divyansh' && password === 'admin123') {
      onLoginSuccess(username);
    } else {
      setError('Invalid credentials. Use divyansh / admin123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f17] px-4 font-sans">
      <div className="max-w-md w-full bg-[#111726] border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-wide">Academic QA Portal</h1>
          <p className="text-xs text-slate-400">Institutional Evaluation & Assessment Environment</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/60 flex items-center gap-2 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Student ID / Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b0f17] border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 transition text-white font-medium rounded-xl text-xs tracking-wide shadow-lg shadow-indigo-600/30"
          >
            Sign In to Workspace
          </button>
        </form>

        <div className="text-center text-[11px] text-slate-500 border-t border-slate-800/80 pt-4">
          Evaluation Credentials: <code className="text-slate-400">divyansh</code> / <code className="text-slate-400">admin123</code>
        </div>
      </div>
    </div>
  );
};