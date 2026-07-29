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

      <div className="w-full max-w-[1100px] relative z-10">
        <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr] items-start">
          <div className="rounded-[2rem] border border-slate-800/80 bg-slate-950/80 p-8 sm:p-10 glass-card shadow-2xl shadow-slate-950/40">
            <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white shadow-xl shadow-sky-500/30 mb-6 w-fit">
              <Car className="w-8 h-8" />
            </div>
            <p className="text-xs uppercase tracking-[0.28em] text-sky-400 font-semibold mb-4">
              Modern dealership access
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Welcome to AutoVault — where dealership inventory feels premium.
            </h1>
            <p className="mt-5 text-sm text-slate-400 max-w-2xl leading-7">
              Sign in or register to manage high-value vehicles, track stock levels, and keep your showroom operating with a polished, business-ready experience.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-900/75 border border-slate-800 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold mb-3">Dealer Focus</p>
                <p className="text-sm text-slate-200 leading-6">Designed for sales teams that need fast vehicle search, proactive stock status, and clean inventory control.</p>
              </div>
              <div className="rounded-3xl bg-slate-900/75 border border-slate-800 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold mb-3">Business-ready</p>
                <p className="text-sm text-slate-200 leading-6">Secure admin controls, role-based access, and inventory tools tailored for professional car retailers.</p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Fast login</p>
                <p className="text-lg font-bold text-white">Instant access</p>
              </div>
              <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Inventory</p>
                <p className="text-lg font-bold text-white">Real-time stock</p>
              </div>
              <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">Control</p>
                <p className="text-lg font-bold text-white">Admin-ready</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-6 sm:p-8 shadow-2xl border border-slate-800/80 backdrop-blur-xl">
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

            <div className="mt-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-4 text-sm text-slate-400">
              <p className="font-semibold text-slate-200 mb-2">Admin Login / Registration</p>
              <p className="leading-6">
                To sign in as an administrator, use the <strong>Demo Admin</strong> button below or register and select <strong>Inventory Administrator</strong> as your account role.
                Admin users receive access to inventory management, restocking, and edit controls.
              </p>
            </div>

            <div className="mt-7 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-4 text-sm text-slate-400">
              <p className="font-semibold text-slate-200 mb-2">Why AutoVault?</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Secure access for sales and inventory teams.</li>
                <li>Instant inventory updates and stock alerts.</li>
                <li>Purpose-built for car dealership workflows.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-3 text-center text-slate-400 text-[11px]">
          <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <ShieldCheck className="w-4 h-4 text-sky-400 mx-auto mb-1" />
            JWT authentication
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <Sparkles className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            Atomic purchase flow
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <Layers className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            Role-based access
          </div>
        </div>
      </div>
    </div>
  );
};
