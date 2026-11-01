'use client';

import React, { useState, useEffect } from 'react';
import { Download, Check, X, Smartphone, ShieldCheck } from 'lucide-react';

export function AdminPwaInstallPrompt({ className = '', variant = 'button' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker if supported
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          // Successfully registered
        })
        .catch((err) => {
          console.warn('Admin SW registration note:', err?.message || err);
        });
    }

    // 2. Check if already installed
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true)
    ) {
      setIsInstalled(true);
      return;
    }

    // 3. Detect iOS Safari
    if (typeof window !== 'undefined') {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIphoneOrIpad = /iphone|ipad|ipod/.test(userAgent);
      if (isIphoneOrIpad && !window.navigator.standalone) {
        setIsIOS(true);
      }
    }

    // 4. Capture beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSInstructions(true);
    }
  };

  if (isInstalled || isDismissed) {
    return null;
  }

  if (!deferredPrompt && !isIOS) {
    return null;
  }

  if (variant === 'button') {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer ${className}`}
          title="Install VARNAM Admin Console on your device"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install Admin App</span>
        </button>

        {showIOSInstructions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-stone-200 text-stone-900 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                <span className="font-bold flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-orange-600" />
                  <span>Install Admin Console on iOS</span>
                </span>
                <button
                  onClick={() => setShowIOSInstructions(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-stone-600 leading-relaxed mb-3">
                To install VARNAM Admin on iOS:
              </p>
              <ol className="list-decimal pl-4 space-y-1.5 text-stone-700 font-medium mb-4">
                <li>Tap the <strong>Share</strong> button at the bottom of Safari.</li>
                <li>Tap <strong>Add to Home Screen</strong>.</li>
                <li>Tap <strong>Add</strong> in the top right corner.</li>
              </ol>
              <button
                onClick={() => setShowIOSInstructions(false)}
                className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={`bg-orange-50/80 border border-orange-200/80 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs shadow-xs ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="truncate">
          <p className="font-bold text-stone-900 truncate">Install Admin Console</p>
          <p className="text-[11px] text-stone-500 truncate">
            Dedicated desktop & mobile shortcut
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
        >
          Install
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-orange-100/50"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

