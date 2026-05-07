"use client";
import React, { useEffect, useRef } from 'react';
import { KpiCard } from '@/components/dashboard/KpiCard';
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

  useEffect(() => {
    gsap.fromTo(".kpi-grid > div", 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Bonjour, Mme Habibou 👋</h1>
        <p className="text-slate-500">Voici l'état actuel de votre centre de formation.</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 kpi-grid">
        <KpiCard 
          title="Apprenants Actifs" 
          value="124" 
          icon={Users} 
          trend={12} 
          color="blue"
          subtitle="Données Nell App"
        />
        <KpiCard 
          title="Sessions en cours" 
          value="18" 
          icon={GraduationCap} 
          color="purple"
          subtitle="Données Digiforma"
        />
        <KpiCard 
          title="Retards de paiement" 
          value="4 250 €" 
          icon={AlertCircle} 
          trend={-5} 
          color="orange"
          subtitle="Données Inqom"
        />
        <KpiCard 
          title="Opportunités CRM" 
          value="12 400 €" 
          icon={Target} 
          trend={24} 
          color="green"
          subtitle="Données Hubspot"
        />
      </div>

      {/* Bottom Section - Example with Interconnection logic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Interconnexion en temps réel</h2>
            <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Synchronisé via N8N
            </div>
          </div>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
             <p className="text-slate-400">Graphique de corrélation Nell App / Inqom à venir...</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock className="text-slate-400" size={20} />
            Événements internes
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