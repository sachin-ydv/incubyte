import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export const RegisterForm = ({ onSuccess }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password, role);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 p-3.5 text-sm rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
          Account Role
        </label>
        <div className="relative">
          <ShieldCheck className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-lg text-sm text-slate-100 focus:outline-none transition-all appearance-none bg-slate-900"
          >
            <option value="user">Customer (Standard User)</option>
            <option value="admin">Inventory Administrator</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-lg text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Create Account
          </>
        )}
      </button>
    </form>
  );
};
