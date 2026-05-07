"use client";
import React, { useEffect, useRef, useState } from 'react';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { createClient } from '@/utils/supabase/client';
import { 
  Users, 
  GraduationCap, 
  AlertCircle, 
  Target, 
  Clock 
} from 'lucide-react';
import gsap from 'gsap';

export default function OverviewPage() {
  const containerRef = useRef(null);
  const [sessionCount, setSessionCount] = useState<number | string>("...");
  const [activeSessionCount, setActiveSessionCount] = useState<number | string>("...");
  const supabase = createClient();

  useEffect(() => {
    // Animation GSAP au montage
    gsap.fromTo(".kpi-grid > div", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );

    // Fetch des VRAIES données Digiforma depuis Supabase
    const fetchDigiformaStats = async () => {
      // Compte total
      const { count: total } = await supabase
        .from('training_sessions')
        .select('*', { count: 'exact', head: true });
      
      // Compte des sessions "en cours"
      const { count: active } = await supabase
        .from('training_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'in_progress');

      if (total !== null) setSessionCount(total);
      if (active !== null) setActiveSessionCount(active);
    };

    fetchDigiformaStats();
  }, [supabase]);

  return (
    <div ref={containerRef} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bonjour, Mme Habibou 👋</h1>
        <p className="text-slate-500">Voici l'état actuel de votre centre de formation synchronisé en temps réel.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 kpi-grid">
        <KpiCard 
          title="Apprenants Actifs" 
          value="En attente" 
          icon={Users} 
          color="blue"
          subtitle="Connexion Nell App requise"
        />
        <KpiCard 
          title="Sessions (Digiforma)" 
          value={sessionCount} 
          icon={GraduationCap} 
          trend={typeof activeSessionCount === 'number' ? activeSessionCount : undefined}
          color="purple"
          subtitle={`${activeSessionCount} actuellement en cours`}
        />
        <KpiCard 
          title="Retards de paiement" 
          value="En attente" 
          icon={AlertCircle} 
          color="orange"
          subtitle="Connexion Inqom requise"
        />
        <KpiCard 
          title="Opportunités CRM" 
          value="En attente" 
          icon={Target} 
          color="green"
          subtitle="Connexion Hubspot requise"
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Flux d'interconnexion (N8N)</h2>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              API Digiforma Connectée
            </div>
          </div>
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50">
             <GraduationCap className="text-brand-300 w-12 h-12 mb-3" />
             <p className="text-slate-500 font-medium">Les données de Digiforma remontent parfaitement.</p>
             <p className="text-sm text-slate-400 mt-1">En attente des autres connecteurs pour générer les graphiques croisés.</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="text-slate-400" size={20} />
            Ressources Internes
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1 bg-brand-500 rounded-full" />
              <div>
                <p className="text-sm font-bold">Examen Compta Pro</p>
                <p className="text-xs text-slate-500">Demain, 09:00 - Salle A1</p>
              </div>
            </div>
            <div className="flex gap-4 opacity-50">
              <div className="w-1 bg-orange-500 rounded-full" />
              <div>
                <p className="text-sm font-bold italic">Location Voiture (H. Grondin)</p>
                <p className="text-xs text-slate-500">Terminé aujourd'hui</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}