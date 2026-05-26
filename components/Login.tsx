
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CR);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.toLowerCase().includes('@rungta')) {
      setError('AUTHORIZED CREDENTIALS REQUIRED.');
      return;
    }

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split(/[.@]/)[0].toUpperCase(),
      email: email,
      role: role,
      section: role === UserRole.CR ? 'SEC-1' : undefined
    };

    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-[#050b18] flex items-center justify-center p-6 blueprint-bg overflow-hidden relative">
      <div className="w-full max-w-md relative z-10">
        <div className="glass-blueprint rounded-[2.5rem] p-10 shadow-2xl border border-white/10">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-brand font-black text-white uppercase tracking-tighter">Portal Access</h2>
            <p className="text-cyan-500/50 font-mono-tech text-[10px] mt-2 tracking-[0.2em] uppercase">Identity Verification Required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="grid grid-cols-2 gap-3">
              {(['CR', 'FACULTY'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`py-3 rounded-xl border font-mono-tech text-[10px] uppercase tracking-widest transition-all ${role === r ? 'bg-cyan-600 border-cyan-400 text-white' : 'bg-slate-900/50 border-white/5 text-slate-500'}`}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity@rungta.org"
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-slate-700 focus:outline-none focus:border-cyan-500/50 font-mono-tech text-sm"
              />
            </div>

            {error && <div className="text-amber-500 text-[9px] font-mono-tech bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 text-center uppercase tracking-widest">{error}</div>}

            <button
              type="submit"
              className="w-full bg-cyan-600 text-white py-4 rounded-xl font-mono-tech font-bold tracking-widest uppercase hover:bg-cyan-500 transition-all shadow-lg"
            >
              Initialize Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
