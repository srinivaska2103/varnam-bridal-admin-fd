'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { adminApi } from '@/services/adminApi';
import { useAdminAuthStore } from '@/store/adminAuthStore';
import { ShieldCheck, Mail, KeyRound, ArrowRight, AlertCircle, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFDF9] flex items-center justify-center"><div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAdminAuthStore();

  const [email, setEmail] = useState('vexatech.connect@gmail.com');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('EMAIL'); // 'EMAIL' | 'OTP'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(searchParams?.get('expired') ? 'Your administrative session has expired. Please sign in again.' : '');
  const [successMessage, setSuccessMessage] = useState('');

  // Step 1: Request 6-digit OTP to Admin Email
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await adminApi.requestOtp(email);
      setSuccessMessage(res.message || `A 6-digit verification code has been sent to ${email}`);
      setStep('OTP');
    } catch (err) {
      setError(err.message || 'Access denied. Only registered platform Super Admin emails can sign in.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP & Issue Super Admin Session
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await adminApi.verifyOtp(email, otp);
      const { user, token } = res.data;

      if (!user.is_super_admin) {
        throw new Error('Access denied. This account does not possess Super Admin platform privileges.');
      }

      setAuth({ user, token });
      router.push('/');
    } catch (err) {
      setError(err.message || 'Invalid or expired code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col justify-center items-center p-4 text-[#292524] selection:bg-orange-100 selection:text-orange-900">
      <div className="max-w-md w-full bg-white border border-stone-200/90 rounded-3xl p-8 shadow-xl shadow-stone-200/50">
        {/* Brand Header with VARNAM Logo */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-16 h-16 rounded-2xl bg-orange-50/70 border border-orange-200/80 p-2 flex items-center justify-center shadow-xs mb-3.5">
            <Image
              src="/varnam-logo.png"
              alt="VARNAM Logo"
              width={56}
              height={56}
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">VARNAM</h2>
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 mt-1 uppercase tracking-wider bg-orange-50/80 border border-orange-200/60 px-3 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-orange-600" />
            <span>Super Admin Portal</span>
          </div>
          <p className="text-xs text-stone-500 mt-2 font-medium">
            Passwordless OTP authentication strictly for platform administrators
          </p>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {successMessage && step === 'OTP' && (
          <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Step 1: Admin Email Input */}
        {step === 'EMAIL' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4 text-xs">
            <div>
              <label className="block text-stone-700 font-bold mb-1.5 text-xs">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter authorized administrator email"
                  className="w-full px-3.5 py-2.5 bg-stone-50/50 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-medium"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-stone-400 mt-1.5">
                A one-time verification password will be delivered to your registered mailbox.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full mt-2 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-900/10 hover:shadow-orange-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Login Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: 6-Digit OTP Code Verification */
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-stone-700 font-bold text-xs">
                  6-Digit Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setStep('EMAIL');
                    setOtp('');
                    setError('');
                  }}
                  className="text-[11px] text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                >
                  Change Email
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit code"
                  className="w-full px-3.5 py-3 bg-stone-50/50 border border-stone-300 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all text-center tracking-[0.3em] font-mono text-base font-bold"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <p className="text-[11px] text-stone-500 mt-1.5 text-center">
                Code sent to <strong className="text-stone-800">{email}</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full mt-2 py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl shadow-md shadow-orange-900/10 hover:shadow-orange-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-xs cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Verify & Enter Super Admin</span>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={loading}
                className="text-[11px] text-stone-500 hover:text-orange-600 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Resend code</span>
              </button>
            </div>
          </form>
        )}

        <div className="mt-7 pt-5 border-t border-stone-100 text-center text-[11px] text-stone-400">
          Varnam Admin Panel &bull; Super Admin Multi-Tenant Core
        </div>
      </div>
    </div>
  );
}
