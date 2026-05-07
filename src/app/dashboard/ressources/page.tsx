"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { InternalResource } from '@/types/database';
import { 
  Car, 
  Calendar, 
  Plane, 
  Plus, 
  Clock, 
  User,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function InternalResourcesPage() {
  const [resources, setResources] = useState<InternalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchResources = async () => {
      const { data, error } = await supabase
        .from('internal_resources')
        .select('*')
        .order('start_time', { ascending: true });
      
      if (!error && data) setResources(data);
      setLoading(false);
    };
    fetchResources();
  }, []);

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'leave': return { bg: 'bg-blue-50', text: 'text-blue-700', icon: Plane, label: 'Congés' };
      case 'car_rental': return { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: Car, label: 'Véhicule' };
      case 'exam_event': return { bg: 'bg-purple-50', text: 'text-purple-700', icon: Calendar, label: 'Examen' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', icon: Clock, label: 'Autre' };
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion Interne</h1>
          <p className="text-slate-500">Logistique, planning d'équipe et ressources partagées.</p>
        </div>
        <button className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-brand-500/20 active:scale-95">
          <Plus size={18} />
          Nouvelle demande
        </button>
      </div>

      {/* Grid des catégories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Véhicules', count: '2 disponibles', icon: Car, color: 'text-emerald-600' },
          { label: 'Congés en attente', count: '3 demandes', icon: Plane, color: 'text-blue-600' },
          { label: 'Événements (Examen)', count: '1 cette semaine', icon: Calendar, color: 'text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-5">
            <div className={`p-4 rounded-xl bg-slate-50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-lg font-bold text-slate-900">{stat.count}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Liste des activités */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="font-bold text-slate-900 flex items-center gap-2">
            <Clock size={18} className="text-slate-400" />
            Planning à venir
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-slate-400 animate-pulse">Chargement du planning...</div>
          ) : resources.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                <Calendar className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-500 font-medium">Aucun événement prévu pour le moment.</p>
            </div>
          ) : (
            resources.map((item) => {
              const style = getTypeStyles(item.type);
              return (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={item.id} 
                  className="p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${style.bg} ${style.text}`}>
                      <style.icon size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${style.bg} ${style.text}`}>
                          {style.label}
                        </span>
                        <h3 className="font-bold text-slate-900">{item.title}</h3>
                      </div>
                      <p className="text-sm text-slate-500 flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><Calendar size={14} /> 
                          {new Date(item.start_time).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                        </span>
                        <span className="flex items-center gap-1.5"><User size={14} /> {item.assigned_to || 'Non assigné'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block mr-4">
                      <p className="text-xs text-slate-400 font-medium">Statut</p>
                      <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={14} /> Confirmé
                      </p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-lg hover:bg-white hover:shadow-sm transition-all">
                      Détails
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Alerte démo : Location de voiture */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex items-start gap-4">
        <AlertCircle className="text-amber-600 shrink-0" size={24} />
        <div>
          <h4 className="font-bold text-amber-900">Rappel Logistique</h4>
          <p className="text-sm text-amber-700 leading-relaxed">
            Le véhicule **Renault Clio (Réunion-974)** doit passer au contrôle technique le 15 du mois prochain. 
            Pensez à bloquer la ressource dans le calendrier de location.
          </p>
        </div>
      </div>
    </div>
  );
}