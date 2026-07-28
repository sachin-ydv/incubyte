import React, { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { Car, ShieldCheck, Sparkles, Layers } from 'lucide-react';

export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-xl shadow-sky-500/30 mb-4">
            <Car className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Welcome to AutoVault
          </h1>
          <p className="text-sm text-slate-400 mt-1.5">
            Car Dealership Inventory & Management Portal
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900/90 rounded-xl mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'login'
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'register'
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {activeTab === 'login' ? <LoginForm /> : <RegisterForm onSuccess={() => setActiveTab('login')} />}
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-3 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <ShieldCheck className="w-4 h-4 text-sky-400 mx-auto mb-1" />
            <span className="text-[11px] text-slate-400 block font-medium">JWT Auth</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <Sparkles className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-[11px] text-slate-400 block font-medium">Atomic Purchase</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <Layers className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-[11px] text-slate-400 block font-medium">Role Access</span>
          </div>
        </div>
      </div>
    </div>
  );
};
