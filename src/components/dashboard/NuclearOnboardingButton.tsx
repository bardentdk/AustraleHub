"use client";
import React, { useState } from 'react';
import { Rocket, Loader2, CheckCircle } from 'lucide-react';

interface Props {
  dealId: string;
  clientName: string;
}

export function NuclearOnboardingButton({ dealId, clientName }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const triggerOnboarding = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/actions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
          // Le token a été retiré d'ici pour des raisons de sécurité !
        },
        body: JSON.stringify({
          action_type: 'NUCLEAR_ONBOARDING',
          payload: { dealId, clientName }
        })
      });

      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <button
      onClick={(e) => { e.stopPropagation(); triggerOnboarding(); }}
      disabled={status !== 'idle'}
      className={`
        w-full mt-3 flex items-center justify-center gap-2 py-2 rounded-xl font-bold text-xs transition-all
        ${status === 'idle' ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-500/20' : ''}
        ${status === 'loading' ? 'bg-slate-100 text-slate-400' : ''}
        ${status === 'success' ? 'bg-emerald-100 text-emerald-700' : ''}
        ${status === 'error' ? 'bg-red-100 text-red-700' : ''}
      `}
    >
      {status === 'loading' ? <Loader2 size={14} className="animate-spin" /> : 
       status === 'success' ? <CheckCircle size={14} /> : <Rocket size={14} />}
      
      {status === 'idle' && "Onboarding Nucléaire"}
      {status === 'loading' && "Synchronisation..."}
      {status === 'success' && "Client Intégré !"}
      {status === 'error' && "Erreur"}
    </button>
  );
}